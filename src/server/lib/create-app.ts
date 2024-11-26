import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound } from "next/navigation";
import { AppBindings } from "../types";

import { defaultHook } from "stoker/openapi";
import { mypinoLooger } from "../middleware/pino-logger";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook: defaultHook,
  });
}

export default function createApp() {
  const app = createRouter().basePath("/api");

  app.use(mypinoLooger());

  app.notFound(notFound);

  return app;
}
