import { createRouter } from "@/server/lib/create-app";
import * as handlers from "./auth.handlers";
import * as routes from "./auth.route";

const router = createRouter()
  .openapi(routes.login, handlers.login)
  .openapi(routes.getVerificationCode, handlers.getVerificationCode)
  .openapi(routes.getResetPasswordRequest, handlers.getResetPasswordRequest)
  .openapi(routes.resetPasswordRoute, handlers.resetPassword)
  .openapi(routes.logout, handlers.logout);

export default router;
