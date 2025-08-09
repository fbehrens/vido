import { sqliteTable, AnySQLiteColumn, text } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const person = sqliteTable("person", {
	name: text(),
});

