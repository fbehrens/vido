import { readdirSync, statSync } from "fs";
import { join } from "path";
import { db } from "$lib/server/db/index.js";
import { clips, movies } from "$lib/server/db/schema.js";
import { sql } from "drizzle-orm";

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
    /\.(mov|mp4|mkv)$/i.test(f.filename),
  );
  const movies_ = await db
    .select({
      filename: movies.filename,
      id: movies.id,
      duration: movies.duration,
      create: sql<number>`CASE WHEN segments IS NULL THEN 1 ELSE 0 END`,
    })
    .from(movies);
  const clips_ = await db
    .select({ id: clips.id, movieId: clips.movieId })
    .from(clips);
  const fns = [...movies_, ...files].map(({ filename }) => filename);

  const join = [...new Set(fns)]
    .map((fn) => ({
      ...files.find((f) => f.filename === fn),
      ...movies_.find((f) => f.filename === fn),
    }))
    .map((m) => ({
      ...m,
      clips: clips_.filter((c: any) => c.movieId === m.id).map((c) => c.id),
    }));
  return { files: join };
}
