import { createRouter } from "@/server/lib/create-app";
import * as handlers from "./users.handlers";
import * as routes from "./users.route";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.createCustomer, handlers.createCustomer)
  .openapi(routes.updateCustomer, handlers.updateCustomer)
  .openapi(routes.getOneCustomerById, handlers.getOneCustomerById)
  .openapi(routes.updateCustomerPassword, handlers.updateCustomerPassword);

export default router;
