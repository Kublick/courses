import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { createErrorSchema } from "stoker/openapi/schemas";
import { insertCourseSchema, selectCourseSchema } from "@/server/db/schema";

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

export type ListCoursesRoute = typeof list;
export type CreateCoursesRoute = typeof create;
