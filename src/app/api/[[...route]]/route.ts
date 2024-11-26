import app from "@/server/app";
import { handle } from "hono/vercel";

export const OPTIONS = handle(app);
export const GET = handle(app);
export const POST = handle(app);
