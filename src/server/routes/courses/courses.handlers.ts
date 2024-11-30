import { AppRouteHandler } from "@/server/types";
import {
  CreateCoursesRoute,
  GetOneCourseRoute,
  ListCoursesRoute,
} from "./courses.route";
import db from "@/server/db";

import { courses } from "@/server/db/schema";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { eq } from "drizzle-orm";

const generateSlug = async (title: string): Promise<string> => {
  const baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  let slug = baseSlug;

  let count = 0;
  while (true) {
    const existingSlug = await db
      .select()
      .from(courses)
      .where(eq(courses.slug, slug));

    if (existingSlug.length === 0) {
      break;
    }

    count++;
    slug = `${baseSlug}-${count}`;
  }

  return slug;
};

export const create: AppRouteHandler<CreateCoursesRoute> = async (c) => {
  c.var.logger.info("Creating course");

  const data = c.req.valid("json");

  await db.query.courses.findFirst({
    where: eq(courses.title, data.title),
  });

  const slug = await generateSlug(data.title);

  const [createCourse] = await db
    .insert(courses)
    .values({
      title: data.title,
      description: data.description,
      price: data.price,
      slug: slug,
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

export const getOneBySlug: AppRouteHandler<GetOneCourseRoute> = async (c) => {
  const { slug } = c.req.valid("param");

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slug));

  if (!course) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(course, HttpStatusCodes.OK);
};
