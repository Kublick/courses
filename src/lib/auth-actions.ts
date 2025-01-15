"use server";
import { client } from "@/server/client";

export const validateVerificationCode = async (id: string) => {
  const code = await client.api.auth[":slug"].$get({
    param: { slug: id },
  });

  const result = (await code.json()) as { message: string; status: boolean };

  if (result.status) {
    return {
      email: result.message,
      status: true,
    };
  } else {
    return {
      email: result.message,
      status: true,
    };
  }
};
