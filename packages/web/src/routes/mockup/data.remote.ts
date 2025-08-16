import { query } from "$app/server";
import { readdirSync } from "fs";
export const getMockups = query(async () => {
  return readdirSync("src/routes/mockup", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
});
