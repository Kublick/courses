import { createRoute } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { selectPurchaseSchema } from "@/server/db/schema";

export const PaymentRequestSchema = z.object({
  amount: z.number().min(1),
  currency: z.string().length(3),
  description: z.string().min(1),
  email: z.string().email(),
});

const PaymentResponseSchema = z.object({
  paymentIntentId: z.string(),
  clientSecret: z.string().nullable(),
  amount: z.number(),
  status: z.string(),
});

export const createPaymentRoute = createRoute({
  tags: ["payments"],
  path: "/payments",
  method: "post",
  request: {
    body: jsonContentRequired(
      PaymentRequestSchema,
      "The section name to update"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      PaymentResponseSchema,
      "Payment intent was successful"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Invalid Requests"
    ),
  },
});

const checkoutRequestSchema = z.object({
  priceId: z.string().min(1),
});

const checkoutResponseSchema = z.object({
  url: z.string().url(),
});

export const checkoutPayment = createRoute({
  tags: ["payments"],
  path: "/payments/checkout",
  method: "post",
  request: {
    body: jsonContentRequired(
      checkoutRequestSchema,
      "Checkout request with price ID"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      checkoutResponseSchema, // { url: string; }
      "Checkout session created successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({ message: z.string() }),
      "Invalid request"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ message: z.string() }),
      "Internal server error"
    ),
  },
});

export const getCustomerPayments = createRoute({
  tags: ["payments"],
  path: "/payments/customer/{customerId}",
  method: "get",
  request: {
    params: z.object({
      customerId: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPurchaseSchema.array(),
      "List of payments for the customer"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Purchases from that customer not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "An error occurred"
    ),
  },
});

export type CreatePaymentRoute = typeof createPaymentRoute;
export type CheckoutRoute = typeof checkoutPayment;
export type GetCustomerPaymentsRoute = typeof getCustomerPayments;
