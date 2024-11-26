import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case",
  schema: schema,
});

export default db;
