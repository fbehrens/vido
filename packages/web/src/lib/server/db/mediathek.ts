import { env } from "$env/dynamic/private";
import Database from "better-sqlite3";
import * as schema_mediathek from "./schema/mediathek";

import { drizzle } from "drizzle-orm/better-sqlite3";
if (!env.MEDIATHEK_URL) throw new Error("MEDITHEK_URL is not set");
export const dbPathMediathek = env.MEDIATHEK_URL;
export const db_mediathek_better = new Database(dbPathMediathek);
export const db_mediathek = drizzle({ client: db_mediathek_better, schema: schema_mediathek });
