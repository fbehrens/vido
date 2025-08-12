import { defineConfig } from "drizzle-kit";
if (!process.env.MEDIATHEK_URL) throw new Error("MEDIATHEK_URL is not set");

export default defineConfig({
  schema: "./src/lib/server/db/schema/mediathek.ts",
  dbCredentials: {
    url: process.env.MEDIATHEK_URL,
  },
  verbose: true,
  strict: true,
  dialect: "sqlite",
  tablesFilter: ["films", "films_import", "mediathek"],
});
