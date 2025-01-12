import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { IdUUIDParamsSchema } from "stoker/openapi/schemas";

export const updateSectionPosition = createRoute({
  tags: ["sections"],
  path: "/sections/position",
  method: "post",
  request: {
    body: jsonContentRequired(
      z.array(
        z.object({
          id: z.string(),
          position: z.number(),
        })
      ),
      "An array of sections to update"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Sections positions updated"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "No Section found"
    ),
  },
});

export const deleteOneById = createRoute({
  tags: ["sections"],
  path: "/sections/{id}",
  method: "delete",
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "The section was deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "The section was not found"
    ),
  },
});

export type UpdateSectionPosition = typeof updateSectionPosition;
export type DeleteSectionById = typeof deleteOneById;
