import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./drizzle",
  dbCredentials: {
    url: "local.db",
  },
});
