import { AppRouteHandler } from "@/server/types";
import { CreateUserRoute, UserListRoute } from "./users.route";
import * as HttpStatusCodes from "stoker/http-status-codes";
import db from "@/server/db";
import { users } from "@/server/db/schema";
import { hashPassword } from "@/server/lib/utils";
import { eq } from "drizzle-orm";

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

  // TODO send validation email

  return c.json(newUser, HttpStatusCodes.OK);
};
