import { db } from "$lib/db";
import type { Movie } from "$lib/types.js";
import { artefactSave } from "$lib/util";
import { getMovie, updateMovie } from "$lib/sqlite.js";
import { getDuration, extractMp3 } from "$lib/ffmpeg.js";
import { transcribe } from "$lib/whisper";

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
  whisper: async ({ request }) => {
    const formData = await request.formData();
    const start = Number(formData.get("start")!);
    const filename = `static/${String(formData.get("filename")!)}`;
    console.log({ start });
    const length = 12;
    const mp3Path = artefactSave(filename, "mp3", start);
    await extractMp3(filename, start, length, mp3Path);
    console.log({ mp3Path });
    const t = await transcribe(mp3Path);
    artefactSave(filename, "text", start, t.text);
    artefactSave(filename, "words", start, t.words);
    artefactSave(filename, "segments", start, t.segments);
    return {
      success: true,
      data: { description: `done` },
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
