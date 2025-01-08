import { readdirSync, statSync } from "fs";
import { join, extname } from "path";
import { db } from "$lib/server/db/index.js";
import { captions, movies } from "$lib/server/db/schema.js";
import { eq, isNotNull } from "drizzle-orm";
import { createMovie, createTranscription } from "$lib/util/transcribe";
import { redirect, type Actions } from "@sveltejs/kit";

export async function load({}) {
  console.log("+page.server.ts(load)");
  const mvs = await db.query.movies.findMany({
    columns: {
      id: true,
      title: true,
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
  return { mvs };
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
    await db.delete(captions).where(eq(captions.movieId, id));
  },
} satisfies Actions;
