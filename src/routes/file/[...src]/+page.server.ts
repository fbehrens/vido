import { db } from "$lib/db";
import type { Movie } from "$lib/types.js";
import { getMovie, updateMovie } from "$lib/sqlite.js";
import { getDuration } from "$lib/ffmpeg.js";

export async function load({ params }) {
  console.log({ serverload: params });
  const filename = "/" + params.src;
  let movie: Movie = { filename };
  movie = getMovie(db, movie);
  if (!movie.duration) {
    movie.duration = await getDuration(`static${filename}`);
    updateMovie(db, movie);
  }
  return { movie };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const actions = {
  foo: async ({ request }) => {
    const formData = await request.formData();
    const entries = Object.fromEntries(formData);
    console.log(entries);
    return {
      success: true,
      data: { description: `${entries.description}_foo` },
    };
  },
  foo1: async ({ request }) => {
    const formData = await request.formData();
    const entries = Object.fromEntries(formData);
    console.log(entries);
    return {
      success: true,
      data: { description: `${entries.description}_foo1` },
    };
  },
};
