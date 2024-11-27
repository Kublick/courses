import { createRouter } from "@/server/lib/create-app";
import * as handlers from "./lectures.handlers";
import * as routes from "./lectures.route";

const router = createRouter().openapi(routes.create, handlers.create);

export default router;
