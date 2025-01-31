import { AppRouteHandler } from "@/server/types";
import {
  CreateCustomerRoute,
  CreateUserRoute,
  GetOneByIdRoute,
  UpdateCustomerPasswordRoute,
  UpdateCustomerRoute,
  UserListRoute,
} from "./users.route";
import * as HttpStatusCodes from "stoker/http-status-codes";
import db from "@/server/db";
import { emailVerificationCode, users } from "@/server/db/schema";
import { hashPassword, verifyHash } from "@/server/lib/utils";
import { eq } from "drizzle-orm";
import { client } from "@/server/client";

export const list: AppRouteHandler<UserListRoute> = async (c) => {
  c.var.logger.info("Listing users");

  const users = await db.query.users.findMany();

  return c.json(users);
};

export const create: AppRouteHandler<CreateUserRoute> = async (c) => {
  c.var.logger.info("Creating user");

  const { email, password, username } = c.req.valid("json");

  const existingEmail = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingEmail.length > 0) {
    return c.json(
      {
        message: "El Usuario ya existe",
      },
      HttpStatusCodes.CONFLICT
    );
  }

  const normalizedEmail = email.toLowerCase();

  const hashedPassword = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({
      username: username,
      email: normalizedEmail,
      password_hash: hashedPassword,
    })
    .returning({
      id: users.id,
    });

  return c.json(newUser, HttpStatusCodes.OK);
};

export const createCustomer: AppRouteHandler<CreateCustomerRoute> = async (
  c
) => {
  c.var.logger.info("Creating user");

  const { name, lastname, password, email } = c.req.valid("json");

  const [existingEmail] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!existingEmail) {
    return c.json(
      {
        message: "El Usuario no existe",
      },
      HttpStatusCodes.CONFLICT
    );
  }

  const hashedPassword = await hashPassword(password);

  const [update] = await db
    .update(users)
    .set({
      name,
      lastname,
      password_hash: hashedPassword,
      email_verification: true,
    })
    .where(eq(users.id, existingEmail.id))
    .returning();

  await db
    .delete(emailVerificationCode)
    .where(eq(emailVerificationCode.email, email));

  await client.api.email.$post({
    json: {
      name: name ? name : "Colega",
      subject: "Registro Exitoso",
      to: email,
      link: `${process.env.NEXT_PUBLIC_URL}/auth/login`,
      type: "confirm_registration",
    },
  });

  return c.json({ id: update.id }, HttpStatusCodes.OK);
};

export const updateCustomer: AppRouteHandler<UpdateCustomerRoute> = async (
  c
) => {
  c.var.logger.info("Updating user");

  const param = c.req.valid("param");
  const { name, lastname, email } = c.req.valid("json");

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, param.id));

    if (!existingUser) {
      return c.json({ message: "User not found" }, HttpStatusCodes.NOT_FOUND);
    }

    // Only check email conflicts if email is being changed
    if (email && email.toLowerCase() !== existingUser.email) {
      const existingEmail = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()));

      if (existingEmail.length > 0) {
        return c.json(
          { message: "Email already in use" },
          HttpStatusCodes.CONFLICT
        );
      }
    }

    await db
      .update(users)
      .set({
        name,
        lastname,
        email: email ? email.toLowerCase() : existingUser.email,
      })
      .where(eq(users.id, param.id))
      .returning();

    return c.json(
      {
        message: "User updated",
      },
      HttpStatusCodes.OK
    );
  } catch (err) {
    console.error("Error updating user:", err);
    return c.json(
      {
        message: "Something went wrong",
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

export const getOneCustomerById: AppRouteHandler<GetOneByIdRoute> = async (
  c
) => {
  c.var.logger.info("Getting user by id");

  const { id } = c.req.valid("param");

  try {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        lastname: users.lastname,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, id));

    if (!user) {
      return c.json({ message: "User not found" }, HttpStatusCodes.NOT_FOUND);
    }

    return c.json(user, HttpStatusCodes.OK);
  } catch (err) {
    console.error("Error fetching user:", err);
    return c.json(
      { message: "Something went wrong" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateCustomerPassword: AppRouteHandler<
  UpdateCustomerPasswordRoute
> = async (c) => {
  c.var.logger.info("Password Update");

  const { id } = c.req.valid("param");
  const { password, currentPassword } = c.req.valid("json");

  const [existingUser] = await db.select().from(users).where(eq(users.id, id));

  if (!existingUser) {
    return c.json({ message: "User not found" }, HttpStatusCodes.NOT_FOUND);
  }

  const verify = await verifyHash(existingUser.password_hash!, currentPassword);

  if (!verify) {
    return c.json(
      {
        message: "La contraseña actual no es correcta",
      },
      HttpStatusCodes.CONFLICT
    );
  }
  const hashedPassword = await hashPassword(password);

  try {
    const passwordUpdate = await db
      .update(users)
      .set({
        password_hash: hashedPassword,
      })
      .where(eq(users.id, id))
      .returning();

    if (!passwordUpdate) {
      return c.json({ message: "User not found" }, HttpStatusCodes.NOT_FOUND);
    }

    return c.json({ message: "Password Updated" }, HttpStatusCodes.OK);
  } catch (err) {
    console.error("Error updating password", err);
    return c.json(
      { message: "Something went wrong" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
