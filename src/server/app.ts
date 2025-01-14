import configureOpenApi from "./lib/configure-open-api";
import createApp from "./lib/create-app";
import index from "./routes/index.route";
import auth from "./routes/auth/auth.index";
import user from "./routes/users/users.index";
import courses from "./routes/courses/courses.index";
import lectures from "./routes/lectures/lectures.index";
import webhooks from "./routes/webhooks/webhooks.index";
import sections from "./routes/sections/sections.index";
import payments from "./routes/payments/payments.index";
import email from "./routes/email/email.index";
import { initializeStripe } from "./lib/stripe-client";
// import { honoStripe } from "./routes/stripe/stripe-hono";

const app = createApp();

configureOpenApi(app);

const STRIPE_WEBHOOK_URL = "/api/webhooks/stripe";

app.use(STRIPE_WEBHOOK_URL, async (c, next) => {
  const stripe = initializeStripe();
  const signature = c.req.header("stripe-signature");
  const rawBody = await c.req.text();

  try {
    // Validate Stripe signature
    stripe.webhooks.constructEvent(
      rawBody,
      signature || "",
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("Webhook signature validated");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Invalid signature", err.message);
    }
    return c.json({ error: "Invalid signature" }, 400);
  }

  await next();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/", index)
  .route("/", auth)
  .route("/", user)
  .route("/", courses)
  .route("/", lectures)
  .route("/", webhooks)
  .route("/", sections)
  .route("/", payments)
  .route("/", email);

// app.route("/", honoStripe);

export type AppType = typeof routes;

export default app;
