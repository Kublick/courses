import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { selectUserSchema } from "@/server/db/schema";
import { createErrorSchema } from "stoker/openapi/schemas";

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
});

export const list = createRoute({
  tags: ["users"],
  path: "/users",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectUserSchema),
      "The list of tasks"
    ),
  },
});

export const create = createRoute({
  tags: ["users"],
  path: "/users/register",
  method: "post",
  request: {
    body: jsonContentRequired(CreateUserSchema, "The user to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.string(),
      }),
      "The created user"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(CreateUserSchema),
      "The user already exists"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "The user already exists"
    ),
  },
});

export type UserListRoute = typeof list;
export type CreateUserRoute = typeof create;
