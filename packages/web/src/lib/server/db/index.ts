import { env } from "$env/dynamic/private";
// import { drizzle } from "drizzle-orm/libsql";
import Database from "better-sqlite3";
import * as schema from "./schema/vido";
import * as schema_mediathek from "./schema/mediathek";

import { drizzle } from "drizzle-orm/better-sqlite3";
if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
if (!env.MEDIATHEK_URL) throw new Error("MEDITHEK_URL is not set");
const dbPath = env.DATABASE_URL;
export const dbPathMediathek = env.MEDIATHEK_URL;
export const db_better = new Database(env.DATABASE_URL);
export const db_mediathek_better = new Database(dbPathMediathek);
export const db = drizzle({ client: db_better, schema });
export const db_mediathek = drizzle({ client: db_mediathek_better, schema: schema_mediathek });
