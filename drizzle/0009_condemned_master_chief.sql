CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" text,
	"asset_id" text,
	"playback_id" text,
	"passthrough" text,
	"duration" double precision,
	"upload_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "lectures" ADD COLUMN "video" uuid;--> statement-breakpoint
ALTER TABLE "lectures" ADD CONSTRAINT "lectures_video_videos_id_fk" FOREIGN KEY ("video") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;