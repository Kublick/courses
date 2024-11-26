import { hc } from "hono/client";
import { AppType } from "./app";
if (!process.env.NEXT_PUBLIC_URL) {
  throw new Error("Missing environment variable NEXT_PUBLIC_URL");
}

export const client = hc<AppType>(process.env.NEXT_PUBLIC_URL!);
