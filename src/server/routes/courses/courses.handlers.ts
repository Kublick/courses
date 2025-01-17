import { AppRouteHandler } from "@/server/types";
import {
  CreateCourseSection,
  CreateCoursesRoute,
  GetOneCourseRoute,
  ListCoursesRoute,
} from "./courses.route";
import db from "@/server/db";

import { courses, sections } from "@/server/db/schema";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { eq } from "drizzle-orm";

import { initializeStripe } from "@/server/lib/stripe-client";

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
  const stripe = initializeStripe();
  const data = c.req.valid("json");

  await db.query.courses.findFirst({
    where: eq(courses.title, data.title),
  });

  const slug = await generateSlug(data.title);

  try {
    const product = await stripe.products.create({
      name: data.title,
      description: data.description,
    });
    console.log(
      "🚀 ~ constcreate:AppRouteHandler<CreateCoursesRoute>= ~ product:",
      product
    );

    const priceInCents = data.price * 100;

    const price = await stripe.prices.create({
      unit_amount: priceInCents,
      currency: "usd",
      product: product.id,
    });
    console.log(
      "🚀 ~ constcreate:AppRouteHandler<CreateCoursesRoute>= ~ price:",
      price
    );

    const [createCourse] = await db
      .insert(courses)
      .values({
        title: data.title,
        description: data.description,
        price: data.price,
        slug: slug,
        stripe_price_id: price.id,
        stripe_product_id: product.id,
      })
      .returning();
    return c.json(createCourse, HttpStatusCodes.OK);
  } catch (e) {
    console.log(e);
    return c.json(
      {
        error: {
          issues: [
            {
              code: "INTERNAL_SERVER_ERROR",
              path: [],
              message: "An unexpected error occurred.",
            },
          ],
          name: "Error",
        },
        success: false,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  // TOOD integrate with stripe api
};

export const list: AppRouteHandler<ListCoursesRoute> = async (c) => {
  c.var.logger.info("Listing courses");

  const courses = await db.query.courses.findMany();

  return c.json(courses);
};

export const getOneBySlug: AppRouteHandler<GetOneCourseRoute> = async (c) => {
  const slug = c.req.param("slug");

  c.var.logger.info("Getting course by slug", slug);

  const courseData = await db.query.courses.findFirst({
    where: eq(courses.slug, slug),
    with: {
      sections: {
        with: {
          lectures: {
            with: {
              video: true,
            },
          },
        },
      },
    },
  });

  if (!courseData) {
    return c.json({ message: "Course not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(courseData, HttpStatusCodes.OK);
};

export const createCourseSection: AppRouteHandler<CreateCourseSection> = async (
  c
) => {
  c.var.logger.info("Creating section");

  const { title, course_id, position } = c.req.valid("json");

  const [createSection] = await db
    .insert(sections)
    .values({
      title,
      course_id,
      position,
    })
    .returning();

  return c.json(createSection, HttpStatusCodes.OK);
};
