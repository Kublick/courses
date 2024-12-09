import { AppRouteHandler } from "@/server/types";

import * as HttpStatusCodes from "stoker/http-status-codes";
import db from "@/server/db";
import { lectures } from "@/server/db/schema";

import {
  CreateLectureRoute,
  DeleteLectureByIdRoute,
  LectureListRoute,
} from "./lectures.route";
import { eq } from "drizzle-orm";

export const create: AppRouteHandler<CreateLectureRoute> = async (c) => {
  c.var.logger.info("Creating lecture");

  const {
    title,
    description,
    content_type,
    content_url,
    section_id,
    position,
  } = c.req.valid("json");

  const [createLecture] = await db
    .insert(lectures)
    .values({
      title,
      description,
      content_type,
      content_url,
      section_id,
      position,
    })
    .returning();

  return c.json(createLecture, HttpStatusCodes.OK);
};

export const list: AppRouteHandler<LectureListRoute> = async (c) => {
  c.var.logger.info("Listing lectures");

  const lecture = await db.select().from(lectures);

  return c.json(lecture, HttpStatusCodes.OK);
};

export const deleteById: AppRouteHandler<DeleteLectureByIdRoute> = async (
  c
) => {
  c.var.logger.info("Deleting Lecture");

  const lecture = await db
    .delete(lectures)
    .where(eq(lectures.id, c.req.param("id")));

  if (!lecture) {
    return c.json({ message: "Lecture not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({ message: "Lecture deleted" }, HttpStatusCodes.OK);
};
