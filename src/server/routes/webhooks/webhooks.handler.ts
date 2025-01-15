import { AppRouteHandler } from "@/server/types";
import {
  MuxWebhookEventSchema,
  MuxWebHookRoute,
  StripeWebHookRoute,
} from "./weehooks.route";
import Mux from "@mux/mux-node";
import { z } from "@hono/zod-openapi";
import db from "@/server/db";
import { emailVerificationCode, users, videos } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import Stripe from "stripe";
import { nanoid } from "nanoid";
import { client } from "@/server/client";

const mux = new Mux();

export const muxWebHook: AppRouteHandler<MuxWebHookRoute> = async (c) => {
  const logger = c.var.logger;
  logger.info("Webhook received");

  try {
    const rawBody = await c.req.text();
    const headers = c.req.raw.headers;

    mux.webhooks.verifySignature(
      rawBody,
      headers,
      process.env.MUX_WEBHOOK_SECRET!
    );

    const { type, data } = MuxWebhookEventSchema.parse(JSON.parse(rawBody));
    console.log("webhook type", type, data);
    switch (type) {
      case "video.upload.created":
        console.log("video.upload.created");
        break;
      case "video.asset.created":
        await handleAssetCreated(data);
        break;
      case "video.asset.ready":
        await handleAssetReady(data);
        break;
      case "video.upload.asset_created":
        console.log("video.upload.asset_created");
        break;
      case "video.live_stream.started":
        await handleLiveStreamStarted(data);
        break;
      case "video.live_stream.ended":
        await handleLiveStreamEnded(data);
        break;
      case "video.asset.deleted":
        await handleAssetDeleted(data);
        break;
      default:
        logger.warn("Unhandled event type:", JSON.stringify(type));
    }
    return c.json({ success: true }, HttpStatusCodes.OK);
  } catch (error) {
    logger.error("Webhook processing error:", error);
    return c.json(
      { error: "Webhook processing failed" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const stripeWebhook: AppRouteHandler<StripeWebHookRoute> = async (c) => {
  try {
    const event = await c.req.json();

    if (!event) {
      return c.json({ error: "No Events Received" }, 400);
    }

    console.log(JSON.stringify(event, null, 2));

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(JSON.stringify(event, null, 2));
        await handleCheckoutSessionCompleted(session);
        break;
      }
      default:
        break;
    }

    return c.json({ success: true }, HttpStatusCodes.OK);
  } catch (err) {
    console.log(err);
    return c.json(
      { error: "Internal server error" },
      HttpStatusCodes.BAD_REQUEST
    );
  }
};

// MUX CASES
async function handleAssetCreated(
  data: z.infer<typeof MuxWebhookEventSchema>["data"]
) {
  const { id, status, passthrough } = data;

  if (!passthrough) {
    return;
  }

  const [video] = await db
    .select()
    .from(videos)
    .where(eq(videos.passthrough, passthrough));

  if (!video) {
    throw new Error("Video not found");
  }

  if (video.status !== "ready") {
    await db
      .update(videos)
      .set({
        status: status,
        asset_id: id,
        playback_id: data.playback_ids?.[0]?.id,
      })
      .where(eq(videos.id, video.id));
  }
}

async function handleAssetReady(
  data: z.infer<typeof MuxWebhookEventSchema>["data"]
) {
  const { status, passthrough, duration } = data;

  if (!passthrough) {
    return;
  }

  try {
    const video = await db.query.videos.findFirst({
      where: (videos, { eq }) => eq(videos.passthrough, passthrough),
    });

    if (!video) {
      throw new Error("Video not found");
    }

    await db
      .update(videos)
      .set({
        status,
        duration: duration,
      })
      .where(eq(videos.id, video.id));
  } catch (error) {
    console.error("Error handling asset ready:", error);
  }
}

async function handleLiveStreamStarted(
  data: z.infer<typeof MuxWebhookEventSchema>["data"]
) {
  console.log("Live stream started:", data);
}

async function handleLiveStreamEnded(
  data: z.infer<typeof MuxWebhookEventSchema>["data"]
) {
  console.log("Live stream ended:", data);
}

async function handleAssetDeleted(
  data: z.infer<typeof MuxWebhookEventSchema>["data"]
) {
  const { passthrough } = data;

  if (!passthrough) {
    return;
  }

  await db.delete(videos).where(eq(videos.passthrough, passthrough));
}

//STRIPE CASES
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const email = session.customer_details?.email;
  const name = session.customer_details?.name;

  if (!email) {
    throw new Error("Email not provided in checkout session.");
  }

  const verificationCode = nanoid();
  try {
    let customer;

    customer = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (customer?.email_verification) {
      await client.api.email.$post({
        json: {
          name: customer.name ? customer.name : "Colega",
          subject: "Bienvenido al curso",
          to: email,
          link: `${process.env.NEXT_PUBLIC_URL}/auth/login/`,
          type: "returning",
        },
      });
    }

    if (!customer) {
      const [newUser] = await db
        .insert(users)
        .values({
          email: email,
          role: "customer",
        })
        .returning({
          id: users.id,
        });

      customer = newUser;
    }

    const [code] = await db
      .insert(emailVerificationCode)
      .values({
        userid: customer.id,
        email: email,
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        used: false,
        code: verificationCode,
      })
      .returning({
        code: emailVerificationCode.code,
      });

    // Step 3: Send the email
    await client.api.email.$post({
      json: {
        name: name ? name : "Colega",
        subject: "Bienvenido al curso",
        to: email,
        link: `${process.env.NEXT_PUBLIC_URL}/auth/registro/${verificationCode}`,
        type: "welcome",
      },
    });

    return { customer, verificationCode: code };
  } catch (error) {
    console.error("Error creating user or sending email:", error);
    throw error;
  }
}
