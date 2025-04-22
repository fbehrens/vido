import { readdirSync } from "fs";
export function load({}) {
  return {
    pages: readdirSync("src/routes/mockup", { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name),
  };
}
