import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const person1 = sqliteTable("person1", {
  name: text(),
  age: integer(),
});
