import { InferSelectModel, relations } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const roleEnums = pgEnum("roles", ["user", "admin", "customer"]);

export const users = pgTable("users", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  username: t.text().notNull(),
  email: t.text().notNull().unique(),
  password_hash: t.text().notNull(),
  role: roleEnums("role").notNull().default("user"),
  created_at: t.timestamp("created_at").defaultNow().notNull(),
  updated_at: t.timestamp("updated_at"),
  name: t.text(),
  lastname: t.text(),
  phone: t.text(),
  address: t.text(),
}));

export type User = InferSelectModel<typeof users>;

export const insertUserSchema = createInsertSchema(users, {
  username: (schema) =>
    schema.username.min(3, "El Usurio debe tener al menos 3 caracteres"),
  email: (schema) => schema.email.email("El email ingresado no es valido"),
}).pick({
  username: true,
  email: true,
  role: true,
});

export const selectUserSchema = createSelectSchema(users).pick({
  username: true,
  email: true,
  role: true,
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

export const courses = pgTable("courses", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  title: t.text().notNull(),
  description: t.text().notNull(),
  price: t.numeric().notNull(),
  is_published: t.boolean().default(false),
  slug: t.text().notNull().unique(),
  created_at: t.timestamp("created_at").defaultNow().notNull(),
  updated_at: t.timestamp("updated_at"),
}));

export type Course = InferSelectModel<typeof courses>;

export const insertCourseSchema = createInsertSchema(courses, {
  title: (schema) =>
    schema.title.min(3, "El nombre del curso debe tener al menos 3 caracteres"),
  description: (schema) =>
    schema.description.min(
      10,
      "El descripcion del curso debe tener al menos 10 caracteres"
    ),
  price: (schema) =>
    schema.price.min(0, "El precio del curso debe ser mayor a 0"),
}).omit({
  id: true,
  created_at: true,
  updated_at: true,
  slug: true,
  is_published: true,
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

export const sections = pgTable("sections", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  course_id: t
    .uuid()
    .notNull()
    .references(() => courses.id),
  title: t.text().notNull(),
  created_at: t.timestamp("created_at").defaultNow().notNull(),
  updated_at: t.timestamp("updated_at"),
}));

export type Section = InferSelectModel<typeof sections>;

export const insertSectionSchema = createInsertSchema(sections, {
  title: (schema) =>
    schema.title.min(3, "El nombre del curso debe tener al menos 3 caracteres"),
}).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const sectionRelations = relations(sections, ({ one, many }) => ({
  course: one(courses, {
    fields: [sections.course_id],
    references: [courses.id],
  }),
  lectures: many(lectures),
}));

export const lectures = pgTable("lectures", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  section_id: t
    .uuid()
    .notNull()
    .references(() => sections.id),
  title: t.text().notNull(),
  description: t.text(),
  content_type: t.text(),
  content_url: t.text(),
  created_at: t.timestamp("created_at").defaultNow().notNull(),
  updated_at: t.timestamp("updated_at"),
}));

export const lectureRelations = relations(lectures, ({ one, many }) => ({
  section: one(sections, {
    fields: [lectures.section_id],
    references: [sections.id],
  }),
}));

export type Lecture = InferSelectModel<typeof lectures>;

export const insertLectureSchema = createInsertSchema(lectures, {
  title: (schema) =>
    schema.title.min(3, "El nombre del curso debe tener al menos 3 caracteres"),
  description: (schema) =>
    schema.description.min(
      10,
      "El descripcion del curso debe tener al menos 10 caracteres"
    ),
  content_type: (schema) =>
    schema.content_type.min(1, "El tipo de contenido es requerido"),
  content_url: (schema) => schema.content_url.url(),
  section_id: (schema) =>
    schema.section_id.min(1, "Ingrese a que capitulo pertenece"),
}).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const selectLectureSchema = createSelectSchema(lectures).pick({
  id: true,
  title: true,
  description: true,
  content_type: true,
  content_url: true,
  created_at: true,
  updated_at: true,
});
