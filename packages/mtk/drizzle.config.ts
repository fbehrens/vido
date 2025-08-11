import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
