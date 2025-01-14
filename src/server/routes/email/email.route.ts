import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";

const sendEmail = z.object({
  to: z.string(),
  subject: z.string(),
  link: z.string().optional(),
  name: z.string().optional(),
  type: z.enum(["welcome", "returning"]),
});

export const testEmail = createRoute({
  tags: ["email"],
  path: "/email",
  method: "post",
  request: {
    body: jsonContentRequired(sendEmail, "Email to process"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Email sent"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Error sending email"
    ),
  },
});

export type TestEmailRoute = typeof testEmail;
