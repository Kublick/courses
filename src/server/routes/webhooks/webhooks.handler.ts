import { AppRouteHandler } from "@/server/types";
import { MuxWebhookEventSchema, MuxWebHookRoute } from "./weehooks.route";
import Mux from "@mux/mux-node";
import { z } from "@hono/zod-openapi";
import db from "@/server/db";
import { videos } from "@/server/db/schema";
import { eq } from "drizzle-orm";

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
      default:
        logger.warn("Unhandled event type:", JSON.stringify(type));
    }
    return c.json({ success: true }, 200);
  } catch (error) {
    logger.error("Webhook processing error:", error);
    return c.json({ error: "Webhook processing failed" }, 500);
  }
};

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
