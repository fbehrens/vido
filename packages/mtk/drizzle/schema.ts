import {
  sqliteTable,
  text,
  integer,
  sqliteView,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const person = sqliteTable("person", {
  name: text(),
  age: integer(),
});

export const person18 = sqliteView("person_18", {
  name: text(),
  age: integer(),
}).as(sql`select * from person where age > 18`);
