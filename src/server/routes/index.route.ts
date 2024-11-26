import { createRoute } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-app";
import { jsonContent } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import createMessageObjectSchema from "stoker/openapi/schemas/create-message-object";

const router = createRouter().openapi(
  createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema("Incremnta Courses API"),
        "Courses API"
      ),
    },
  }),
  (c) => {
    return c.json(
      {
        message: "Success Response",
      },
      HttpStatusCodes.OK
    );
  }
);

export default router;
