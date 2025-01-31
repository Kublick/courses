import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { selectUserSchema, updateUserSchema } from "@/server/db/schema";
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
      "The list of users"
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

export const updateCustomer = createRoute({
  tags: ["users"],
  path: "/users/:id",
  method: "patch",
  request: {
    body: jsonContentRequired(updateUserSchema, "The user fields to update"),
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "User updated successfully"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Email already in use"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "User not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Invalid update data"
    ),
  },
});

const RegisterForm = z.object({
  name: z.string(),
  lastname: z.string(),
  password: z.string(),
  email: z.string().email(),
});

export const createCustomer = createRoute({
  tags: ["users"],
  path: "/users/customer",
  method: "post",
  request: {
    body: jsonContentRequired(RegisterForm, "The user to create"),
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

export const getOneCustomerById = createRoute({
  tags: ["users"],
  path: "/users/:id",
  method: "get",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectUserSchema, "The user"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "User not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "An error ocurred"
    ),
  },
});

export const updateCustomerPassword = createRoute({
  tags: ["users"],
  path: "/users/:id/password",
  method: "patch",
  request: {
    body: jsonContentRequired(
      z.object({
        password: z.string().min(8, "Password debe ser 8 caracteres"),
        currentPassword: z.string(),
      }),
      "The user password to update"
    ),
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "User password updated successfully"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "User not found"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Invalid password"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "An error ocurred"
    ),
  },
});

export type UserListRoute = typeof list;
export type CreateUserRoute = typeof create;
export type CreateCustomerRoute = typeof createCustomer;
export type UpdateCustomerRoute = typeof updateCustomer;
export type GetOneByIdRoute = typeof getOneCustomerById;
export type UpdateCustomerPasswordRoute = typeof updateCustomerPassword;
