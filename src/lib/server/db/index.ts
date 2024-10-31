import { drizzle } from "drizzle-orm/libsql";
import { env } from "$env/dynamic/private";
if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
  },
});
