import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const person = sqliteTable("person", {
  name: text(),
  age: integer(),
});
