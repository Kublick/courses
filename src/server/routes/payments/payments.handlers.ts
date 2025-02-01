import Stripe from "stripe";
import { AppRouteHandler } from "@/server/types";
import {
  CreatePaymentRoute,
  PaymentRequestSchema,
  CheckoutRoute,
  GetCustomerPaymentsRoute,
} from "./payments.route";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { z } from "zod";
import db from "@/server/db";
import { purchases } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export const createPayment: AppRouteHandler<CreatePaymentRoute> = async (c) => {
  c.var.logger.info("updating section positions");

  const body = c.req.valid("json");

  const validatedData = PaymentRequestSchema.parse(body);

  const { amount, currency, description, email } = validatedData;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      description: description,
      receipt_email: email,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return c.json(
      {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret || null,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ message: "Invalid request data" }, 400);
    }
    return c.json({ message: "Failed to create payment intent" }, 400);
  }
};

export const checkOutPayment: AppRouteHandler<CheckoutRoute> = async (c) => {
  c.var.logger.info("Creating checkout session");

  const { priceId } = c.req.valid("json");

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });

    if (!session.url) {
      return c.json(
        { message: "Failed to create checkout session URL" },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    return c.json(
      { url: session.url },
      HttpStatusCodes.OK // 200
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        { message: "Invalid request" },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    c.var.logger.error("Unexpected error:", error);

    return c.json(
      { message: "Internal Server Error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getCustomerPayments: AppRouteHandler<
  GetCustomerPaymentsRoute
> = async (c) => {
  const { customerId } = c.req.valid("param");

  try {
    const data = await db.query.purchases.findMany({
      where: eq(purchases.user_id, customerId),
      orderBy: (purchases, { desc }) => [desc(purchases.created_at)],
      with: {
        product: true,
      },
    });

    if (!data || data === undefined) {
      return c.json(
        { message: "Purchases from that customer not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(data, HttpStatusCodes.OK);
  } catch (err) {
    return c.json(
      { message: "An error occurred" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
