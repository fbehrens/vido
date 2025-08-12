import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./p/drizzle1",
  dbCredentials: {
    url: process.env.DATABASE1_URL!,
  },
});
