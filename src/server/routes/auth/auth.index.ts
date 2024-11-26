import { createRouter } from "@/server/lib/create-app";
import * as handlers from "./auth.handlers";
import * as routes from "./auth.route";

const router = createRouter()
  .openapi(routes.login, handlers.login)
  .openapi(routes.login, handlers.login);

export default router;
