import { db } from "$lib/db";
import type { Movie, Segment } from "$lib/types.js";
import { getFileDir, makeDirFor } from "$lib/util";
import {
  getMovie,
  insertSegment,
  updateMovie,
  selectSegments,
  insertWord,
  selectWords,
} from "$lib/sqlite.js";
import { getDuration, extractMp3 } from "$lib/ffmpeg.js";
import { transcribe } from "$lib/whisper";
import * as fs from "fs";

export async function load({ params }) {
  console.log({ serverload: params });
  const { filename } = params;
  let movie: Movie = { filename };
  movie = getMovie(db, movie);
  if (!movie.duration) {
    movie.duration = await getDuration(`static/${filename}`);
    updateMovie(db, movie);
  }
  let segments = selectSegments(db, movie.id!);
  return { movie, segments };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const actions = {
  whisper: async ({ request }) => {
    const formData = await request.formData();
    const movie_id = Number(formData.get("id")!);
    const clip = Number(formData.get("clip")!);
    const clip_length = Number(formData.get("clip_length")!);
    const filename = `static/${String(formData.get("filename")!)}`;
    console.log({ start: clip });
    const fileDir = getFileDir(filename);
    const mp3Path = `${fileDir}/mp3/${clip}.mp3`;
    await extractMp3(filename, clip, clip_length, mp3Path);
    console.log(
      `${mp3Path}: ${clip_length}s => ${fs.statSync(mp3Path).size} bytes`,
    );

    const t = await transcribe(mp3Path);
    const txtPath = `${fileDir}/text/${clip}.txt`;
    makeDirFor(txtPath);
    fs.writeFileSync(txtPath, t.text);
    console.log({ txtPath });

    t.segments.forEach((s) => insertSegment(db, movie_id, clip, s));
    t.words.forEach((w) => insertWord(db, movie_id, clip, w));
    return {
      success: true,
      segments: selectSegments(db, movie_id, clip),
    };
  },
  delete: async ({ request }) => {
    const formData = await request.formData();
    const movie_id = Number(formData.get("id")!);
    db.prepare(`delete from segments where movie_id=${movie_id}`).run();
    db.prepare(`delete from words  where movie_id=${movie_id}`).run();
    return {
      success: true,
    };
  },
};
