import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";

import {
  createErrorSchema,
  IdParamsSchema,
  SlugParamsSchema,
} from "stoker/openapi/schemas";
import { insertCourseSchema, selectCourseSchema } from "@/server/db/schema";
import { notFoundSchema } from "@/server/lib/constants";

export const list = createRoute({
  tags: ["courses"],
  path: "/courses",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectCourseSchema),
      "The list of courses"
    ),
  },
});

export const create = createRoute({
  tags: ["courses"],
  path: "/courses",
  method: "post",
  request: {
    body: jsonContentRequired(insertCourseSchema, "The course to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectCourseSchema, "The created course"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      createErrorSchema(insertCourseSchema),
      "You dont have permission to create a course"
    ),
  },
});

export const getOneBySlug = createRoute({
  tags: ["courses"],
  path: "/courses/{slug}",
  method: "get",
  request: {
    params: SlugParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectCourseSchema, "The course"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task not found"),
  },
});

export type ListCoursesRoute = typeof list;
export type CreateCoursesRoute = typeof create;
export type GetOneCourseRoute = typeof getOneBySlug;
