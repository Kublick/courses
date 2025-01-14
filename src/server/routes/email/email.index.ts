import { createRouter } from "@/server/lib/create-app";
import * as handlers from "./email.handlers";
import * as routes from "./email.route";

const router = createRouter().openapi(routes.testEmail, handlers.sendEmail);

export default router;
