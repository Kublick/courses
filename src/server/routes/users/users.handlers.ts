import { AppRouteHandler } from "@/server/types";
import {
  CreateCustomerRoute,
  CreateUserRoute,
  UserListRoute,
} from "./users.route";
import * as HttpStatusCodes from "stoker/http-status-codes";
import db from "@/server/db";
import { emailVerificationCode, users } from "@/server/db/schema";
import { hashPassword } from "@/server/lib/utils";
import { eq } from "drizzle-orm";
import { VerificationCodeRoute } from "../auth/auth.route";

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

  return c.json({ id: update.id }, HttpStatusCodes.OK);
};
