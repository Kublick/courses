import { cache } from "react";
import { hash, verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { validateSessionToken } from "../auth";

export async function verifyHash(hash: string, password: string) {
  const success = await verify(hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  return success;
}

export async function hashPassword(password: string) {
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  return passwordHash;
}

export const getUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;

  if (token === null) {
    return { session: null, user: null };
  }
  const result = await validateSessionToken(token);
  return result;
});
