import { readdirSync, statSync } from "fs";
import { join } from "path";
import { db } from "$lib/server/db/index.js";
import { clips, movies } from "$lib/server/db/schema.js";
import { sql } from "drizzle-orm";
import { concat } from "drizzle-orm/mysql-core/expressions";

export interface MyFile {
  filename: string;
  size: number;
}

const dir = process.cwd() + "/static/";

function getAllFiles(dirPath: string, arrayOfFiles: MyFile[] = []) {
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
    /\.(mov|mp4|mkv)$/i.test(f.filename),
  );
  const mc = await db.query.movies.findMany({
    columns: {
      id: true,
      filename: true,
      duration: true,
    },
    extras: {
      create: sql<boolean>`CASE WHEN segments IS NULL THEN 1 ELSE 0 END`.as(
        "create",
      ),
    },
    with: {
      clips: {
        columns: {
          id: true,
        },
      },
    },
  });
  type MovieWithExtras = typeof movies.$inferSelect & {
    create: boolean;
    clips: {
      id: number;
    }[];
  };

  type FileWithMovie = MyFile & Partial<MovieWithExtras>;

  const join: FileWithMovie[] = files.map((m) => {
    const mc_ = mc.find((e) => e.filename === m.filename) || {};
    return { ...m, ...mc_ };
  });
  return { files: join };
}
