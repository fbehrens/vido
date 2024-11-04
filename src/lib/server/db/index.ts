import { env } from "$env/dynamic/private";
// import { drizzle } from "drizzle-orm/libsql";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const client = new Database(env.DATABASE_URL);
// export const db = drizzle({ connection: { url: env.DATABASE_FILE }, schema });
export const db = drizzle({ client, schema });
