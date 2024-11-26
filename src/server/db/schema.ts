import { InferSelectModel } from "drizzle-orm";
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
  ispublished: t.boolean().default(false),
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
  ispublished: true,
});

export const selectCourseSchema = createSelectSchema(courses).pick({
  id: true,
  title: true,
  description: true,
  price: true,
  created_at: true,
  updated_at: true,
});
