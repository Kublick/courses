import { AppRouteHandler } from "@/server/types";
import { CreateCoursesRoute, ListCoursesRoute } from "./courses.route";
import db from "@/server/db";
import { eq } from "drizzle-orm";
import { courses } from "@/server/db/schema";
import * as HttpStatusCodes from "stoker/http-status-codes";

export const create: AppRouteHandler<CreateCoursesRoute> = async (c) => {
  c.var.logger.info("Creating course");

  const data = c.req.valid("json");

  const existingCourse = await db.query.courses.findFirst({
    where: eq(courses.title, data.title),
  });

  const [createCourse] = await db
    .insert(courses)
    .values({
      title: data.title,
      description: data.description,
      price: data.price,
    })
    .returning();

  // TOOD integrate with stripe api

  return c.json(createCourse, HttpStatusCodes.OK);
};

export const list: AppRouteHandler<ListCoursesRoute> = async (c) => {
  c.var.logger.info("Listing courses");

  const courses = await db.query.courses.findMany();

  return c.json(courses);
};
