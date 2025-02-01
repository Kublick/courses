import { createRouter } from "@/server/lib/create-app";
import * as handlers from "./payments.handlers";
import * as routes from "./payments.route";

const router = createRouter()
  .openapi(routes.createPaymentRoute, handlers.createPayment)
  .openapi(routes.checkoutPayment, handlers.checkOutPayment)
  .openapi(routes.getCustomerPayments, handlers.getCustomerPayments);

export default router;
