import { createRoute, z } from "@hono/zod-openapi";

export const MuxWebhookEventSchema = z.object({
  type: z.enum([
    "video.asset.created",
    "video.asset.ready",
    "video.live_stream.started",
    "video.live_stream.ended",
    "video.upload.asset_created",
    "video.upload.created",
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
    200: {
      description: "Webhook successfully processed",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
          }),
        },
      },
    },
    400: {
      description: "Invalid webhook signature or payload",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
    403: {
      description: "Invalid webhook signature",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
    500: {
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

export type MuxWebHookRoute = typeof muxWebHook;
