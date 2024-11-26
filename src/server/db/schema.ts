import { pgEnum, pgTable } from "drizzle-orm/pg-core";

export const roleEnums = pgEnum("roles", ["user", "admin", "customer"]);

export const users = pgTable("users", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  username: t.text().notNull(),
  email: t.text().notNull().unique(),
  password_hash: t.text().notNull(),
  role: roleEnums("role").notNull().default("user"),
}));
