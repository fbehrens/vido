import { command, query } from "$app/server";
import { getDuration, getFramerate } from "$lib/ffmpeg";
import { db } from "$lib/server/db";
import { movies } from "$lib/server/db/schema/vido";
import { sqliteDate } from "$lib/utils";
import { isNotNull } from "drizzle-orm";
import { readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { file } from "zod/v4";

export interface MyFile {
  filename: string;
  size: number;
  id?: number;
}

const static_dir = process.cwd() + "/static/";

function getAllFiles(dirPath: string, arrayOfFiles: MyFile[] = []) {
  const files = readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = join(dirPath, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push({
        filename: filePath.replace(static_dir, ""),
        size: stat.size,
      });
    }
  });
  return arrayOfFiles;
}
const extsVideo = [".mov", ".mp4", ".mkv"];

const files = async () => {
  const ms: Map<
    string,
    { id: number; title: string; duration: number; framerate: number; created_at: string }
  > = new Map();
  for (const { id, filename, title, duration, framerate, created_at } of await db
    .select({
      id: movies.id,
      filename: movies.filename,
      title: movies.title,
      duration: movies.duration,
      framerate: movies.framerate,
      created_at: movies.created_at,
    })
    .from(movies)
    .where(isNotNull(movies.filename))) {
    ms.set(filename!, { id, title, duration, framerate: framerate!, created_at });
  }
  const files = getAllFiles(static_dir)
    .filter((f) => extsVideo.includes(extname(f.filename)))
    .map((f) => ({ ...f, ...ms.get(f.filename) }));
  console.log({ ms, files });
  return files;
};
export const getFiles = query(async () => await files());

export const insertMovies = command(async () => {
  const fs = (await files()).filter((f) => f.id === undefined);
  for (const f of fs) {
    const movie = {
      filename: f.filename,
      title: f.filename,
      duration: await getDuration(`static/${f.filename}`),
      framerate: await getFramerate(`static/${f.filename}`),
      created_at: sqliteDate(),
    } as typeof movies.$inferSelect;
    await db.insert(movies).values(movie);
    await getFiles().refresh();
    console.log({ a: "inserted", f, movie });
  }
});
