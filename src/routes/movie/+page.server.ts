import { readdirSync, statSync } from "fs";
import { join } from "path";
import { db } from "$lib/server/db/index.js";
import { clips, movies } from "$lib/server/db/schema.js";
import { sql, eq } from "drizzle-orm";
import { createMovie, createTranscription } from "$lib/util/transcribe";
import type { Actions } from "@sveltejs/kit";

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
  console.log("+page.server.ts(load)");
  const files = getAllFiles(dir).filter((f) =>
    /\.(mov|mp4|mkv)$/i.test(f.filename),
  );
  const mc = (
    await db.query.movies.findMany({
      columns: {
        id: true,
        filename: true,
        duration: true,
      },
      extras: {
        has_segments:
          sql<boolean>`CASE WHEN segments IS NULL THEN 0 ELSE 1 END`.as(
            "create",
          ),
      },
      with: {
        clips: {
          columns: {
            id: true,
          },
          extras: {
            has_segments:
              sql<boolean>`CASE WHEN segments IS NULL THEN 0 ELSE 1 END`.as(
                "create",
              ),
          },
        },
      },
    })
  ).map((m) => {
    const everyClipHasSegments = m.clips.every((c) => c.has_segments);
    return { ...m, everyClipHasSegments };
  });
  //   console.log(mc.find((m) => m.id === 743));
  type MovieWithExtras = typeof movies.$inferSelect & {
    has_segments: boolean;
    everyClipHasSegments: boolean;
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

export const actions = {
  create: async ({ cookies, request }) => {
    const data = await request.formData();
    const filename = <string>data.get("filename");
    const id = <number | null>data.get("id");
    const movie = id
      ? await db.select().from(movies).where(eq(movies.id, id)).get()!
      : await createMovie(filename);
    await createTranscription(movie);
    return { success: true };
  },
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = <number | null>data.get("id");
    if (id === null) return { success: false };
    console.log("delete Movies and clips (", id, ")");
    await db.delete(movies).where(eq(movies.id, id));
    await db.delete(clips).where(eq(clips.movieId, id));
  },
} satisfies Actions;
