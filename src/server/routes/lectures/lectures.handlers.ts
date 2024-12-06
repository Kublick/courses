import { AppRouteHandler } from "@/server/types";

import * as HttpStatusCodes from "stoker/http-status-codes";
import db from "@/server/db";
import { lectures } from "@/server/db/schema";

import { CreateLectureRoute, LectureListRoute } from "./lectures.route";

export const create: AppRouteHandler<CreateLectureRoute> = async (c) => {
  c.var.logger.info("Creating user");

  const { title, description, content_type, content_url, section_id } =
    c.req.valid("json");

  const [createLecture] = await db
    .insert(lectures)
    .values({
      title,
      description,
      content_type,
      content_url,
      section_id,
    })
    .returning();

  return c.json(createLecture, HttpStatusCodes.OK);
};

export const list: AppRouteHandler<LectureListRoute> = async (c) => {
  c.var.logger.info("Listing users");

  const lecture = await db.select().from(lectures);

  return c.json(lecture, HttpStatusCodes.OK);
};
