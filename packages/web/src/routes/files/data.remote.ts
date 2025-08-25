import { command, query } from "$app/server";
import { getDuration, getFramerate } from "$lib/ffmpeg";
import { db } from "$lib/server/db";
import { movies } from "$lib/server/db/schema/vido";
import { sqliteDate } from "$lib/server/utils";
import { isNotNull } from "drizzle-orm";
import { readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const static_dir = process.cwd() + "/static/";
interface FileSystem {
  filename: string;
  size: number;
}

interface FileSystem {
  filename: string;
  size: number;
}

function getAllFiles(dirPath: string): FileSystem[] {
  const result: FileSystem[] = [];
  const stack = [dirPath];

  while (stack.length) {
    const current = stack.pop()!;
    for (const file of readdirSync(current)) {
      const filePath = join(current, file);
      const stat = statSync(filePath);
      if (stat.isDirectory()) {
        stack.push(filePath);
      } else {
        result.push({
          filename: filePath.slice(static_dir.length),
          size: stat.size,
        });
      }
    }
  }
  return result;
}
const extsVideo = [".mov", ".mp4", ".mkv"];

const movis = async () =>
  await db
    .select({
      id: movies.id,
      filename: movies.filename,
      title: movies.title,
      duration: movies.duration,
      framerate: movies.framerate,
      created_at: movies.created_at,
    })
    .from(movies)
    .where(isNotNull(movies.filename));

type Movi = Awaited<ReturnType<typeof movis>>[number];

const db_files = async () => {
  const movis_map = new Map<string, Movi>();
  for (const { id, filename, title, duration, framerate, created_at } of await movis()) {
    movis_map.set(filename!, { id, filename, title, duration, framerate: framerate!, created_at });
  }
  const files = getAllFiles(static_dir)
    .filter((f) => extsVideo.includes(extname(f.filename)))
    .map((f) => ({ ...f, ...movis_map.get(f.filename) }));
  return files;
};
export type Files = Awaited<ReturnType<typeof db_files>>[number];

export const getFiles = query(async () => await db_files());

export const insertMovies = command(async () => {
  const fs = (await db_files()).filter((f) => f.id === undefined);
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
