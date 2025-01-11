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
            title: z.string().nonempty({ message: "Title is required" }),
            description: z
              .string()
              .nonempty({ message: "Description is required" }),
            section_id: z
              .string()
              .nonempty({ message: "Section ID is required" }),
            position: z.string().nonempty({ message: "Position is required" }),
            file: z
              .custom<File>()
              .superRefine((value, ctx) => {
                const file = value;
                if (!file) return true;
                if (
                  !["video/mp4", "video/webm"].includes(file.type) &&
                  file.size > 1024 * 1024 * 2000
                ) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                      '"File must be a video (MP4/WEBM) and less than 2000MB',
                  });
                }
              })
              .nullish(),
            thumbnail: z
              .custom<File>()
              .superRefine((value, ctx) => {
                const file = value;
                if (!file) return true;
                if (
                  ![
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/webp",
                  ].includes(file.type) &&
                  file.size > 1024 * 1024 * 2
                ) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: '"File must be a valid Image and less than 2MB',
                  });
                }
              })
              .nullish(),
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
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Internal server error"
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

export const publishLecture = createRoute({
  tags: ["lectures"],
  path: "/lectures/{id}/publish",
  method: "put",
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(
      z.object({
        is_published: z.boolean(),
      }),
      "The lecture to publish"
    ),
  },

  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "The lecture was published"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "The lecture was not found"
    ),
  },
});

export const updateLecturePosition = createRoute({
  tags: ["lectures"],
  path: "/lectures/position",
  method: "post",
  request: {
    body: jsonContentRequired(
      z.array(
        z.object({
          id: z.string(),
          position: z.number(),
          sectionId: z.string(),
        })
      ),
      "An array of lectures to update"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "The lecture was published"
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
export type PublishLectureRoute = typeof publishLecture;
export type UpdateLecturePositionRoute = typeof updateLecturePosition;
