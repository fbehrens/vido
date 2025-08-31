import { command, query } from "$app/server";
import { getDuration, getFramerate } from "$lib/ffmpeg";
import { db } from "$lib/server/db";
import { captions, movies } from "$lib/server/db/schema/vido";
import { sqliteDate } from "$lib/server/utils";
import { isNotNull, sql } from "drizzle-orm";
import { readFile, unlink, readdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";

const static_dir = process.cwd() + "/static/";

async function getAllFiles(dirPath: string) {
  const result = [];
  const stack = [dirPath];

  while (stack.length) {
    const current = stack.pop()!;
    for (const file of await readdir(current)) {
      const filePath = join(current, file);
      const stat_ = await stat(filePath);
      if (stat_.isDirectory()) {
        stack.push(filePath);
      } else {
        const filename = filePath.slice(static_dir.length);
        const ext = extname(filename).slice(1);
        result.push({
          filename,
          size: stat_.size,
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

const files = () => getAllFiles(static_dir);

export const insertWhisper = command(async () => {
  for (const { filename, basename } of (await files()).filter(({ ext }) => ext == "json")) {
    const glob = basename + ".*";
    const [movie] = await db
      .select({ id: movies.id })
      .from(movies)
      .where(sql`${movies.filename} GLOB ${glob}`);
    const staticFilename = "static/" + filename;
    const data = await readFile(staticFilename, "utf8");
    const caption = { movieId: movie.id, details: "{}", typ: "whisper", data };
    await db.insert(captions).values(caption);
    await unlink(staticFilename);
    console.log({ action: "created caption", ...caption });
  }
});

//
const filesWithMovies = async () => {
  const movis_map = new Map<string, Movie>();
  for (const { id, filename, title, duration, framerate, created_at } of await getMovies()) {
    movis_map.set(filename!, { id, filename, title, duration, framerate: framerate!, created_at });
  }
  const Awaitedfiles = await files();
  const filesMovie = Awaitedfiles.filter((f) => videoExtensions.includes(f.ext)).map((fm) => {
    const subtitles = Awaitedfiles.filter(
      (f) => f.basename == fm.basename && f.filename != fm.filename,
    )
      .map(({ ext }) => ext)
      .join(",");
    return { ...fm, ...movis_map.get(fm.filename), subtitles };
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
