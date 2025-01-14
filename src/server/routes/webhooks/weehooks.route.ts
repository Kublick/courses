import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";

export const MuxWebhookEventSchema = z.object({
  type: z.enum([
    "video.asset.created",
    "video.asset.ready",
    "video.live_stream.started",
    "video.live_stream.ended",
    "video.upload.asset_created",
    "video.upload.created",
    "video.asset.deleted",
  ]),
  data: z.object({
    id: z.string(),
    status: z.string().optional(),
    passthrough: z.string().optional(),
    playback_ids: z
      .array(
        z.object({
          policy: z.string(),
          id: z.string(),
        })
      )
      .optional(),
    duration: z.number().optional(),
  }),
  created_at: z.string(),
});

export const StripeWeebHookSchema = z.object({
  type: z.enum(["checkout.session.completed"]),
});

export const muxWebHook = createRoute({
  tags: ["webhooks"],
  path: "/webhooks/mux",
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: MuxWebhookEventSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      description: "Webhook successfully processed",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
          }),
        },
      },
    },
    [HttpStatusCodes.BAD_REQUEST]: {
      description: "Invalid webhook signature or payload",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
    [HttpStatusCodes.FORBIDDEN]: {
      description: "Invalid webhook signature",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

export const stripeWebhook = createRoute({
  tags: ["webhooks"],
  path: "/webhooks/stripe",
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: StripeWeebHookSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      description: "Webhook successfully processed",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
          }),
        },
      },
    },
    [HttpStatusCodes.BAD_REQUEST]: {
      description: "Invalid payload or signature",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

export type MuxWebHookRoute = typeof muxWebHook;
export type StripeWebHookRoute = typeof stripeWebhook;
