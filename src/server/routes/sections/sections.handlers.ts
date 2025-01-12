import { AppRouteHandler } from "@/server/types";
import { DeleteSectionById, UpdateSectionPosition } from "./sections.route";
import db from "@/server/db";
import { courses, sections } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { lectures } from "../../db/schema";
import { deleteVideo } from "@/server/lib/mux";
import { deleteThumbanil } from "@/lib/s3Actions";

export const updateLecturePosition: AppRouteHandler<
  UpdateSectionPosition
> = async (c) => {
  c.var.logger.info("updating section positions");

  const items = c.req.valid("json");

  for (const section of items) {
    const { id, position } = section;

    try {
      const updatedSection = await db
        .update(sections)
        .set({ position })
        .where(eq(sections.id, id));

      if (!updatedSection) {
        return c.json(
          { message: "No Section found" },
          HttpStatusCodes.NOT_FOUND
        );
      }
    } catch (error) {
      console.log("Error updating lecture position", error);
    }
  }

  return c.json({ message: "Lecture updated" }, HttpStatusCodes.OK);
};

export const deleteSectionById: AppRouteHandler<DeleteSectionById> = async (
  c
) => {
  c.var.logger.info("updating section positions");

  const { id } = c.req.valid("param");

  const section = await db.query.sections.findFirst({
    where: eq(sections.id, id),
    with: {
      lectures: true,
    },
  });

  if (!section) {
    return c.json({ message: "Section not found" }, HttpStatusCodes.NOT_FOUND);
  }

  const lectures = section.lectures ?? [];

  for (const lecture of lectures) {
    await deleteLecture(lecture.id);
  }

  await db.delete(sections).where(eq(sections.id, id));

  c.var.logger.info(
    `Section with ID ${id} and its lectures deleted successfully`
  );

  return c.json(
    { message: "Section and its lectures deleted" },
    HttpStatusCodes.OK
  );
};

export async function deleteLecture(lectureId: string) {
  const lecture = await db.query.lectures.findFirst({
    where: eq(lectures.id, lectureId),
    with: {
      video: true,
    },
  });

  if (!lecture) {
    return { success: false, message: "Lecture not found" };
  }

  const assetId = lecture.video?.asset_id;
  if (assetId) {
    await deleteVideo(assetId);
  }

  if (lecture.poster_url) {
    await deleteThumbanil(lecture.poster_url);
  }

  await db.delete(lectures).where(eq(lectures.id, lectureId));

  return { success: true, message: "Lecture deleted" };
}
