ALTER TABLE "lectures" ADD COLUMN "is_published" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "sections" ADD COLUMN "is_published" boolean DEFAULT false;