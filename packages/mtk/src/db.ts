import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import * as schema_mediathek from "../../web/src/lib/server/db/schema/mediathek";

if (!process.env.MEDIATHEK_URL) throw new Error("MEDIATHEK_URL is not set");
export const dbPathMediathek = process.env.MEDIATHEK_URL;
export const db_mediathek_better = new Database(dbPathMediathek);
export const db_mediathek = drizzle({
  client: db_mediathek_better,
  schema: schema_mediathek,
});
