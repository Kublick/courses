import { hash, verify } from "@node-rs/argon2";

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
