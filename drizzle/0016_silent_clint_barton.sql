ALTER TABLE "courses" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "stripe_product_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "stripe_price_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_stripe_product_id_unique" UNIQUE("stripe_product_id");--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_stripe_price_id_unique" UNIQUE("stripe_price_id");