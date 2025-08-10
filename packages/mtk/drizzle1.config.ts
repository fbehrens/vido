import { defineConfig } from "drizzle-kit";
console.log(__filename);
export default defineConfig({
  dialect: "sqlite",
  schema: "./drizzle1",
  dbCredentials: {
    url: "local.db",
  },
});
