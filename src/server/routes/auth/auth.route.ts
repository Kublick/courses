import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { notFoundSchema, unAuthorizedSchema } from "@/server/lib/constants";

const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const login = createRoute({
  tags: ["auth"],
  path: "/auth/login",
  method: "post",
  request: {
    body: jsonContentRequired(LoginUserSchema, "Successful Login"),
  },
  responses: {
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The user does not exist"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unAuthorizedSchema,
      "Invalid Credentials"
    ),
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Login Success"
    ),
  },
});

export type UserLoginRoute = typeof login;
// export type CreateUserRoute = typeof create;
