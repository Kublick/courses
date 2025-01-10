import { AppRouteHandler } from "@/server/types";
import { UpdateSectionPosition } from "./sections.route";
import db from "@/server/db";
import { sections } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

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
