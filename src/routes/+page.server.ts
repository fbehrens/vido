import { readdir, stat } from "fs/promises";
import { Stats, readdirSync, statSync } from "fs";
import { join } from "path";
import { db } from "$lib/db";
import type { Movie } from "$lib/types";

export interface MyFile {
  filename: string;
  size: number;
}

const dir = process.cwd() + "/static/";

function getAllFiles(dirPath: string, arrayOfFiles: MyFile[] = []): MyFile[] {
  const files = readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = join(dirPath, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push({
        filename: filePath.replace(dir, ""),
        size: stat.size,
      });
    }
  });
  return arrayOfFiles;
}

export async function load({}) {
  const files = getAllFiles(dir).filter((f) =>
    /\.(mov|mp4)$/i.test(f.filename),
  );
  const movies = db
    .prepare(
      "Select filename,id,duration,(CASE WHEN segments IS NULL THEN 1 ELSE 0 END)'create' from movies",
    )
    .all() as Movie[];
  const fns = [...movies, ...files].map(({ filename }) => filename);
  const join = [...new Set(fns)].map((fn) => ({
    ...files.find((f) => f.filename === fn),
    ...movies.find((f) => f.filename === fn),
  }));
  return { files: join };
}
