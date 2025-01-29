import { AppRouteHandler } from "@/server/types";

import db from "@/server/db";
import {
  GetResetPasswordRequest,
  LogoutRoute,
  ResetPasswordRoute,
  UserLoginRoute,
  VerificationCodeRoute,
} from "./auth.route";
import { eq } from "drizzle-orm";
import { emailVerificationCode, users } from "@/server/db/schema";
import { hashPassword, verifyHash } from "@/server/lib/utils";
import * as HttpStatusCodes from "stoker/http-status-codes";
// import * as HttpStatusPhrases from "stoker/http-status-phrases";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  invalidateSession,
  setSessionTokenCookie,
} from "@/server/auth";
import { nanoid } from "nanoid";
import { client } from "@/server/client";
import { getCookie } from "hono/cookie";

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

export const getResetPasswordRequest: AppRouteHandler<
  GetResetPasswordRequest
> = async (c) => {
  c.var.logger.info("Requesting password Reset");

  const { email } = c.req.valid("json");

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

  const verificationCode = nanoid();

  await db.insert(emailVerificationCode).values({
    userid: existingUser.id,
    email: email,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    used: false,
    code: verificationCode,
  });

  await client.api.email.$post({
    json: {
      name: existingUser.name ? existingUser.name : "Colega",
      subject: "Restablecer Contraseña",
      to: email,
      link: `${process.env.NEXT_PUBLIC_URL}/auth/reset/${verificationCode}`,
      type: "password_reset_request",
    },
  });

  return c.json({
    message: "Login Success",
  });
};

export const resetPassword: AppRouteHandler<ResetPasswordRoute> = async (c) => {
  c.var.logger.info("Requesting password Reset");

  const { password, code } = c.req.valid("json");

  const getCode = await db.query.emailVerificationCode.findFirst({
    where: eq(emailVerificationCode.code, code),
  });

  if (!getCode) {
    return c.json({ message: "No code found" }, HttpStatusCodes.NOT_FOUND);
  }

  const hashedPassword = await hashPassword(password);

  await db
    .update(users)
    .set({
      password_hash: hashedPassword,
    })
    .where(eq(users.id, getCode.userid));

  await db
    .delete(emailVerificationCode)
    .where(eq(emailVerificationCode.code, code));

  client.api.email.$post({
    json: {
      to: getCode.email,
      subject: "Cambio de contraseña",
      type: "password_confirmation",
    },
  });

  return c.json({
    message: "Password Updated",
  });
};

export const logout: AppRouteHandler<LogoutRoute> = async (c) => {
  c.var.logger.info("Loggin Out User");

  const sessionToken = getCookie(c, "session");

  if (!sessionToken) {
    return c.redirect("/auth/login");
  }

  invalidateSession(sessionToken);

  deleteSessionTokenCookie(c);

  setSessionTokenCookie(c, "");

  return c.redirect("/auth/login");
};
