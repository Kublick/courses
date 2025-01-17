import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { notFoundSchema, unAuthorizedSchema } from "@/server/lib/constants";
import { IdUUIDParamsSchema, SlugParamsSchema } from "stoker/openapi/schemas";

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

export const getVerificationCode = createRoute({
  tags: ["auth"],
  path: "/auth/{slug}",
  method: "get",
  params: SlugParamsSchema,
  responses: {
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
        status: z.boolean(),
      }),
      "No code exists"
    ),
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
        status: z.boolean(),
      }),
      "Verification Code Success"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Server Error"
    ),
  },
});

export const getResetPasswordRequest = createRoute({
  tags: ["auth"],
  path: "/auth/reset-request",
  method: "post",
  request: {
    body: jsonContentRequired(
      z.object({
        email: z.string().email(),
      }),
      "Successful Login"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Request Sucess"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Not found"
    ),
  },
});

export const resetPasswordRoute = createRoute({
  tags: ["auth"],
  path: "/auth/password-reset",
  method: "post",
  request: {
    body: jsonContentRequired(
      z.object({
        password: z.string().min(3),
        code: z.string(),
      }),
      "Successful Password reset"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Request Sucess"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Not found"
    ),
  },
});

export type UserLoginRoute = typeof login;
export type VerificationCodeRoute = typeof getVerificationCode;
export type GetResetPasswordRequest = typeof getResetPasswordRequest;
export type ResetPasswordRoute = typeof resetPasswordRoute;

// export type CreateUserRoute = typeof create;
