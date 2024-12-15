import { createRouter } from "@/server/lib/create-app";
import * as handlers from "./webhooks.handler";
import * as routes from "./weehooks.route";

const router = createRouter().openapi(routes.muxWebHook, handlers.muxWebHook);

export default router;
