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
      has_segments:
        sql<boolean>`CASE WHEN segments IS NULL THEN 0 ELSE 1 END`.as("create"),
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
    has_segments: boolean;
  };

  type FileWithMovie = MyFile &
    Partial<MovieWithExtras> & {
      clips: {
        id: number;
      }[];
    };

  const join: FileWithMovie[] = files.map((m) => {
    const mc_ = mc.find((e) => e.filename === m.filename) || { clips: [] };
    return { ...m, ...mc_ };
  });
  return { files: join };
}
