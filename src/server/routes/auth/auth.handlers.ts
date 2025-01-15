import { AppRouteHandler } from "@/server/types";

import db from "@/server/db";
import { UserLoginRoute, VerificationCodeRoute } from "./auth.route";
import { eq } from "drizzle-orm";
import { emailVerificationCode, users } from "@/server/db/schema";
import { verifyHash } from "@/server/lib/utils";
import * as HttpStatusCodes from "stoker/http-status-codes";
// import * as HttpStatusPhrases from "stoker/http-status-phrases";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/server/auth";
import { client } from "@/server/client";

export const login: AppRouteHandler<UserLoginRoute> = async (c) => {
  c.var.logger.info("Loggin In User");

  const { email, password } = c.req.valid("json");

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!existingUser) {
    return c.json(
      {
        message: "Verifique email y contraseña",
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const verify = await verifyHash(existingUser.password_hash!, password);

  if (!verify) {
    return c.json(
      {
        message: "Credenciales Incorrectas",
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const sessionToken = generateSessionToken();

  await createSession(sessionToken, existingUser.id);

  setSessionTokenCookie(c, sessionToken);

  return c.json({
    message: "Login Success",
  });
};

export const getVerificationCode: AppRouteHandler<
  VerificationCodeRoute
> = async (c) => {
  c.var.logger.info("Getting Code");

  const slug = c.req.param("slug");
  try {
    const code = await db.query.emailVerificationCode.findFirst({
      where: (emailVerificationCode, { eq }) =>
        eq(emailVerificationCode.code, slug),
    });

    if (!code) {
      return c.json({
        message: "Code Not Found",
        status: false,
      });
    }

    return c.json(
      {
        message: code.email,
        status: true,
      },
      404
    );
  } catch (err) {
    return c.json({ message: "Server Error" }, 500);
  }
};
