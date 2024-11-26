import { createRouter } from "@/server/lib/create-app";
import * as handlers from "./courses.handlers";
import * as routes from "./courses.route";

const router = createRouter()
  .openapi(routes.create, handlers.create)
  .openapi(routes.list, handlers.list);

export default router;