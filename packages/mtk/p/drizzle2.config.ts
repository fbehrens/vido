import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./p/drizzle2",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
