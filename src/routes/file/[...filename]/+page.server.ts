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
  let words = selectWords(db, movie.id!);
  return { movie, segments, words };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const actions = {
  // clip: id,start,end -> db + mp3 -> whisper -> segments+ words
  whisper: async ({ request }) => {
    const formData = await request.formData();
    const movie_id = Number(formData.get("id")!);
    const start = Number(formData.get("clip_start")!);
    const length = Number(formData.get("clip_length")!);
    const end = start + length;

    const id =
      Number(
        db
          .prepare("select COALESCE(MAX(id), 0)  from clips where movie_id =?")
          .pluck(true)
          .get(movie_id),
      ) + 1;
    console.log(id);
    db.prepare(
      "INSERT INTO clips (id, movie_id, start, end) VALUES (?, ?, ?, ?)",
    ).run(id, movie_id, start, end);

    const filename = `static/${String(formData.get("filename")!)}`;
    const fileDir = getFileDir(filename);
    const mp3Path = `${fileDir}/mp3/${id}.mp3`;
    await extractMp3(filename, start, length, mp3Path);
    console.log(`${mp3Path}: ${length}s => ${fs.statSync(mp3Path).size} bytes`);

    const t = await transcribe(mp3Path);
    const txtPath = `${fileDir}/text/${id}.txt`;
    makeDirFor(txtPath);
    fs.writeFileSync(txtPath, t.text);
    console.log({ txtPath });

    t.segments.forEach((s) => insertSegment(db, movie_id, id, s));
    t.words.forEach((w) => insertWord(db, movie_id, id, w));
    return {
      success: true,
      segments: selectSegments(db, movie_id, id),
    };
  },
  delete: async ({ request }) => {
    const formData = await request.formData();
    const movie_id = Number(formData.get("id")!);
    db.prepare(`delete from segments where movie_id=${movie_id}`).run();
    db.prepare(`delete from words where movie_id=${movie_id}`).run();
    db.prepare(`delete from clips where movie_id=${movie_id}`).run();
    console.log(`Delete segments,words and clips for movie_id=${movie_id}`);
    return {
      success: true,
    };
  },
};
