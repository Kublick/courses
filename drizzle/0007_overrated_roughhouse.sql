ALTER TABLE "lectures" DROP CONSTRAINT "lectures_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "lectures" DROP COLUMN IF EXISTS "course_id";