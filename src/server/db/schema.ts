import { z } from "@hono/zod-openapi";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  customType,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createSchemaFactory,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

// Define numeric type
type NumericConfig = {
  precision?: number;
  scale?: number;
};

export const numericCasted = customType<{
  data: number;
  driverData: string;
  config: NumericConfig;
}>({
  dataType: (config) => {
    if (config?.precision && config?.scale) {
      return `numeric(${config.precision}, ${config.scale})`;
    }
    return "numeric";
  },
  fromDriver: (value: string) => Number.parseFloat(value),
  toDriver: (value: number) => value.toString(),
});

const { createInsertSchema } = createSchemaFactory({ zodInstance: z });

// Users
export const roleEnums = pgEnum("roles", ["user", "admin", "customer"]);

export const users = pgTable("users", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  username: t.text(),
  email: t.text().notNull().unique(),
  password_hash: t.text(),
  role: roleEnums("role").notNull().default("user"),
  created_at: t.timestamp({ mode: "string" }).defaultNow().notNull(),
  updated_at: t.timestamp({ mode: "string" }),
  name: t.text(),
  lastname: t.text(),
  phone: t.text(),
  address: t.text(),
  email_verification: t.boolean(),
}));

export type User = InferSelectModel<typeof users>;

export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email("El email ingresado no es valido"),
}).pick({
  email: true,
  role: true,
});

export const insertCustomerSchema = createInsertSchema(users, {
  name: (schema) => schema.min(1, { message: "Nombre es requerido" }),
  lastname: (schema) => schema.min(1, { message: "Apellido es requerido" }),
});

export const selectUserSchema = createSelectSchema(users).pick({
  id: true,
  username: true,
  email: true,
  role: true,
  lastname: true,
  name: true,
});

export type SelectUserSchema = z.infer<typeof selectUserSchema>;

export const updateUserSchema = createUpdateSchema(users).pick({
  name: true,
  email: true,
  lastname: true,
});

export const sessions = pgTable("session", (t) => ({
  id: t.text().primaryKey(),
  userid: t
    .uuid()
    .notNull()
    .references(() => users.id),
  expiresAt: t
    .timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    })
    .notNull(),
}));

export type Session = InferSelectModel<typeof sessions>;

//Verification codes
export const emailVerificationCode = pgTable("emailVerificationCode", (t) => ({
  id: uuid("id").primaryKey().defaultRandom(),
  userid: t
    .uuid()
    .notNull()
    .references(() => users.id),
  email: t.text().notNull(),
  created_at: t.timestamp({ mode: "string" }).defaultNow().notNull(),
  expires_at: t
    .timestamp("expires_at", {
      withTimezone: true,
      mode: "string",
    })
    .notNull(),
  used: t.boolean().default(false),
  code: t.text(),
}));

export type EmailVerificationCode = InferSelectModel<
  typeof emailVerificationCode
>;

export const emailVerificationCodeRelations = relations(
  emailVerificationCode,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationCode.userid],
      references: [users.id],
    }),
  })
);

export const insertEmailVerificationCode = createInsertSchema(
  emailVerificationCode,
  {
    email: (schema) => schema.email("El email ingresado no es valido"),
  }
).pick({
  userid: true,
  email: true,
});

export const userRelations = relations(users, ({ many }) => ({
  emailVerificationCodes: many(emailVerificationCode, {
    relationName: "user_email_verification_code",
  }),
}));
// Purchases
export const purchases = pgTable("purchases", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  user_id: t
    .uuid()
    .notNull()
    .references(() => users.id),
  product_id: t
    .uuid()
    .notNull()
    .references(() => courses.id), // Assuming `courses` are the products
  stripe_id: t.text().notNull(), // Stripe Payment Intent or Session ID
  price: numericCasted({ precision: 10, scale: 2 }).notNull(),
  created_at: t.timestamp({ mode: "string" }).defaultNow().notNull(),
}));

export type Purchase = InferSelectModel<typeof purchases>;

export type PurchaseInsert = InferInsertModel<typeof purchases>;

export const selectPurchaseSchema = createSelectSchema(purchases).pick({
  id: true,
  user_id: true,
  product_id: true,
  stripe_id: true,
  price: true,
  created_at: true,
});

export const purchaseRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.user_id],
    references: [users.id],
  }),
  product: one(courses, {
    fields: [purchases.product_id],
    references: [courses.id],
  }),
}));

// Courses
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text().notNull(),
  price: numericCasted({ precision: 10, scale: 2 }).notNull(),
  is_published: boolean().default(false),
  slug: text().notNull().unique(),
  created_at: timestamp({ mode: "string" }).defaultNow().notNull(),
  updated_at: timestamp({ mode: "string" }),
  deleted_at: timestamp({ mode: "string" }),
  stripe_product_id: text().unique().notNull(), // Stripe's prod_ ID
  stripe_price_id: text().unique().notNull(),
});

export type Course = InferSelectModel<typeof courses>;

export const insertCourseSchema = createInsertSchema(courses, {
  title: (schema) =>
    schema.openapi({ minLength: 3 }).min(3, {
      message: "El nombre del curso debe tener al menos 3 caracteres",
    }),
  description: (schema) =>
    schema.openapi({ minLength: 10 }).min(10, {
      message: "El descripcion del curso debe tener al menos 10 caracteres",
    }),
  price: () =>
    z.coerce
      .number({ message: "El precio del curso debe ser un numero" })
      .min(0, { message: "El precio del curso debe ser mayor a 0" }),
}).omit({
  id: true,
  slug: true,
  is_published: true,
  stripe_product_id: true,
  stripe_price_id: true,
});

export const selectCourseSchema = createSelectSchema(courses).pick({
  id: true,
  title: true,
  description: true,
  price: true,
  created_at: true,
  updated_at: true,
  slug: true,
  is_published: true,
});

export const courseRelations = relations(courses, ({ many }) => ({
  sections: many(sections),
}));

export const sections = pgTable("sections", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  course_id: t
    .uuid()
    .notNull()
    .references(() => courses.id),
  is_published: t.boolean().default(false),
  title: t.text().notNull(),
  created_at: t.timestamp({ mode: "string" }).defaultNow().notNull(),
  updated_at: t.timestamp({ mode: "string" }),
  position: t.integer().default(1).notNull(),
}));

export type Section = InferSelectModel<typeof sections>;

export const selectSectionsSchema = createSelectSchema(sections).omit({
  updated_at: true,
});

export const insertSectionSchema = createInsertSchema(sections, {
  title: (schema) =>
    schema
      .openapi({ minLength: 3 })
      .min(3, "El nombre del curso debe tener al menos 3 caracteres"),
  course_id: (schema) =>
    schema
      .openapi({
        type: "string",
        format: "uuid",
      })
      .uuid(),
  position: (schema) =>
    schema.openapi({
      type: "number",
      minimum: 1,
    }),
}).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const lectures = pgTable("lectures", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  section_id: t.uuid().references(() => sections.id),
  title: t.text().notNull(),
  description: t.text(),
  content_type: t.text(),
  created_at: t.timestamp({ mode: "string" }).defaultNow().notNull(),
  updated_at: t.timestamp({ mode: "string" }),
  position: t.integer().default(1).notNull(),
  video: t.uuid().references(() => videos.id),
  is_published: t.boolean().default(false),
  poster_url: t.text(),
  slug: t.text(),
}));

export type Lecture = InferSelectModel<typeof lectures>;

export const insertLectureSchema = createInsertSchema(lectures, {
  title: (schema) =>
    schema
      .openapi({ minLength: 3 })
      .min(3, "El nombre del curso debe tener al menos 3 caracteres"),
  description: (schema) =>
    schema
      .openapi({ minLength: 10 })
      .min(10, "El descripcion del curso debe tener al menos 10 caracteres"),

  content_type: (schema) =>
    schema
      .openapi({ minLength: 1 })
      .min(1, "El tipo de contenido es requerido"),
  section_id: (schema) => schema.uuid(),
  video: (schema) => schema.uuid().optional(),
  position: (schema) => schema.openapi({ minimum: 1 }),
  poster_url: (schema) => schema.optional(),
})
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
    file: z.custom<File>((value) => value instanceof File, {
      message: "Expected a valid File instance",
    }),
  });

export const selectLectureSchema = createSelectSchema(lectures).pick({
  id: true,
  section_id: true,
  title: true,
  description: true,
  content_type: true,
  position: true,
  video: true,
  is_published: true,
  poster_url: true,
});

export const updateLectureSchema = createUpdateSchema(lectures).omit({
  id: true,
});

export type LectureWithVideo = InferSelectModel<typeof lectures> & {
  video?: InferSelectModel<typeof videos>;
};

export const videos = pgTable("videos", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  status: t.text(),
  asset_id: t.text(),
  playback_id: t.text(),
  passthrough: t.text(),
  duration: t.doublePrecision(),
  upload_id: t.text(),
  created_at: t.timestamp({ mode: "string" }).defaultNow().notNull(),
  updated_at: t.timestamp({ mode: "string" }),
}));

export const insertVideoSchema = createInsertSchema(videos, {
  status: (schema) => schema.openapi({ minLength: 1 }),
  asset_id: (schema) => schema.optional(),
  playback_id: (schema) => schema.optional(),
  passthrough: (schema) => schema.openapi({ minLength: 1 }),
  duration: (schema) => schema.optional(),
  upload_id: (schema) => schema.optional(),
}).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const selectVideoSchema = createSelectSchema(videos).pick({
  id: true,
  status: true,
  asset_id: true,
  playback_id: true,
  passthrough: true,
  duration: true,
  upload_id: true,
});
export type Video = InferSelectModel<typeof videos>;

export const selectLectureSchemaWithVideo = selectLectureSchema.extend({
  video: selectVideoSchema.optional(),
});

export const selectCourseSchemaWithLecturesAndSections = createSelectSchema(
  courses
).extend({
  sections: createSelectSchema(sections)
    .extend({
      lectures: selectLectureSchemaWithVideo.array(),
    })
    .array(),
});

export const sectionWithLectureSchame = createSelectSchema(sections).extend({
  lectures: selectLectureSchemaWithVideo.array(),
});

export type SectionWithLecturesType = z.infer<typeof sectionWithLectureSchame>;

export type CourseWithSectionsAndLectures = InferSelectModel<typeof courses> & {
  sections: (InferSelectModel<typeof sections> & {
    lectures: (InferSelectModel<typeof lectures> & {
      video: InferSelectModel<typeof videos> | null;
    })[];
  })[];
};

export const sectionRelations = relations(sections, ({ one, many }) => ({
  course: one(courses, {
    fields: [sections.course_id],
    references: [courses.id],
  }),
  lectures: many(lectures),
}));

export const lectureRelations = relations(lectures, ({ one }) => ({
  section: one(sections, {
    fields: [lectures.section_id],
    references: [sections.id],
  }),
  video: one(videos, { fields: [lectures.video], references: [videos.id] }),
}));
