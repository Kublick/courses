import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { insertLectureSchema, selectLectureSchema } from "@/server/db/schema";
import { createErrorSchema } from "stoker/openapi/schemas";

export const list = createRoute({
  tags: ["lectures"],
  path: "/lectures",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectLectureSchema),
      "The list of lectures"
    ),
  },
});

export const create = createRoute({
  tags: ["lectures"],
  path: "/lectures",
  method: "post",
  request: {
    body: jsonContentRequired(insertLectureSchema, "The lecture to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.string(),
      }),
      "The created lecture"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertLectureSchema),
      "There is an error creating the lecture"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "The lecture already exists"
    ),
  },
});

export type LectureListRoute = typeof list;
export type CreateLectureRoute = typeof create;
