import { command, query } from "$app/server";
import { getDuration, getFramerate } from "$lib/ffmpeg";
import { db } from "$lib/server/db";
import { movies } from "$lib/server/db/schema/vido";
import { sqliteDate } from "$lib/server/utils";
import { isNotNull } from "drizzle-orm";
import { readdirSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";

const static_dir = process.cwd() + "/static/";

function getAllFiles(dirPath: string) {
  const result = [];
  const stack = [dirPath];

  while (stack.length) {
    const current = stack.pop()!;
    for (const file of readdirSync(current)) {
      const filePath = join(current, file);
      const stat = statSync(filePath);
      if (stat.isDirectory()) {
        stack.push(filePath);
      } else {
        const filename = filePath.slice(static_dir.length);
        const ext = extname(filename).slice(1);
        result.push({
          filename,
          size: stat.size,
          ext,
          basename: filename.slice(0, filename.length - ext.length - 1),
        });
      }
    }
  }
  return result;
}
const videoExtensions = ["mov", "mp4", "mkv"];

const getMovies = async () =>
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

type Movie = Awaited<ReturnType<typeof getMovies>>[number];

//
const filesWithMovies = async () => {
  const movis_map = new Map<string, Movie>();
  for (const { id, filename, title, duration, framerate, created_at } of await getMovies()) {
    movis_map.set(filename!, { id, filename, title, duration, framerate: framerate!, created_at });
  }
  const files = getAllFiles(static_dir);
  const filesMovie = files
    .filter((f) => videoExtensions.includes(f.ext))
    .map((fm) => {
      const subtitles = files
        .filter((f) => f.basename == fm.basename && f.filename != fm.filename)
        .map((f) => f.ext)
        .join(",");
      return { ...fm, subtitles, ...movis_map.get(fm.filename) };
    });
  return filesMovie;
};
export type File = Awaited<ReturnType<typeof filesWithMovies>>[number];

export const getFiles = query(async () => await filesWithMovies());

export const insertMovies = command(async () => {
  const fs = (await filesWithMovies()).filter((f) => f.id === undefined);
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
