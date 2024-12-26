import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";

import {
  insertLectureSchema,
  selectLectureSchema,
  selectLectureSchemaWithVideo,
  updateLectureSchema,
} from "@/server/db/schema";
import { createErrorSchema, IdUUIDParamsSchema } from "stoker/openapi/schemas";
import { notFoundSchema } from "@/server/lib/constants";

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

export const getOneById = createRoute({
  tags: ["lectures"],
  path: "/lectures/{id}",
  method: "get",
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectLectureSchemaWithVideo,
      "The lecture information"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Lecture not found"
    ),
  },
});

export const create = createRoute({
  tags: ["lectures"],
  path: "/lectures",
  method: "post",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            title: z.string(),
            description: z.string(),
            file: z.custom<File>((value) => value instanceof File, {
              message: "Expected a valid File instance",
            }),
            section_id: z.string(),
            position: z.string(),
          }),
        },
      },
    },
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

export const uploadVideo = createRoute({
  tags: ["lectures"],
  path: "/lectures/upload",
  method: "post",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            file: z.custom<File>((value) => value instanceof File, {
              message: "Expected a valid File instance",
            }),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.string(),
      }),
      "The created video"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Validation error"
    ),
  },
});

export const deleteOneById = createRoute({
  tags: ["lectures"],
  path: "/lectures/{id}",
  method: "delete",
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "The lecture was deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "The lecture was not found"
    ),
  },
});

export const updateOneById = createRoute({
  tags: ["lectures"],
  path: "/lectures/{id}",
  method: "put",
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(updateLectureSchema, "The lecture to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "The lecture was updated"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "The lecture was not found"
    ),
  },
});

export type LectureListRoute = typeof list;
export type LectureByIdRoute = typeof getOneById;
export type CreateLectureRoute = typeof create;
export type DeleteLectureByIdRoute = typeof deleteOneById;
export type UpdateLectureByIdRoute = typeof updateOneById;
export type UploadLectureVideo = typeof uploadVideo;
