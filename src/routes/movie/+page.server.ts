import { readdirSync, statSync } from "fs";
import { join } from "path";
import { db } from "$lib/server/db/index.js";
import { clips, movies } from "$lib/server/db/schema.js";
import { sql, eq } from "drizzle-orm";
import { createMovie, createTranscription } from "$lib/util/transcribe";
import { redirect, type Actions } from "@sveltejs/kit";

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
  const mc = await db.query.movies.findMany({
    columns: {
      id: true,
      filename: true,
      duration: true,
    },
    with: {
      captions: {
        columns: {
          typ: true,
        },
      },
    },
  });
  //   console.log(mc.find((m) => m.id === 743));
  const join: FileWithMovie[] = files.map((m) => {
    const mc_ = mc.find((e) => e.filename === m.filename) || { clips: [] };
    return { ...m, ...mc_ };
  });
  console.log(join[0]);
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
    const ready = await createTranscription(movie);
    if (ready) {
      redirect(303, `/movie/${movie.id}`);
    }

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
