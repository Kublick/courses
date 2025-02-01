CREATE SEQUENCE "public"."order_sequence" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9999 START WITH 1 CACHE 1;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "payment_method" text;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "payment_status" text;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "type" text;