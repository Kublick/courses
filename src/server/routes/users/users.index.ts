import { createRouter } from "@/server/lib/create-app";
import * as handlers from "./users.handlers";
import * as routes from "./users.route";

const router = createRouter().openapi(routes.list, handlers.list)
    .openapi(routes.create, handlers.create);

export default router;
