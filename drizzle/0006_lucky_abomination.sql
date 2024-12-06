ALTER TABLE "lectures" ALTER COLUMN "section_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lectures" ADD COLUMN "course_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lectures" ADD CONSTRAINT "lectures_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
