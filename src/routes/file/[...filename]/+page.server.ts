import { db } from "$lib/db";
import type { Movie, Segment } from "$lib/types.js";
import { getFileDir, makeDirFor } from "$lib/util";
import { getMovie, updateMovie, selectWords } from "$lib/sqlite.js";
import { getDuration, extractMp3 } from "$lib/ffmpeg.js";
import { transcribe } from "$lib/whisper";
import * as fs from "fs";
import { alignArrays, updateWordsSegmentId } from "$lib/util/alignArrays";

export async function load({ params }) {
  console.log({ serverload: params });
  const { filename } = params;
  let movie: Movie = { filename };
  movie = getMovie(db, movie);
  if (!movie.duration) {
    movie.duration = await getDuration(`static/${filename}`);
    updateMovie(db, movie);
  }

  const segments = db
    .prepare(
      "SELECT clip_id, start, end, text, id FROM segments_v WHERE movie_id = ?",
    )
    .all(movie.id!) as Segment[];

  //   new Set(segments.map(({ clip_id }) => clip_id)).forEach((clip_id) =>
  //     updateWordsSegmentId({ movie_id: movie.id!, clip_id }),
  //   );

  const words = selectWords(db, movie.id!);
  return { movie, segments };
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

    const clip_id =
      Number(
        db
          .prepare("select COALESCE(MAX(id), 0)  from clips where movie_id =?")
          .pluck(true)
          .get(movie_id),
      ) + 1;

    const filename = `static/${String(formData.get("filename")!)}`;
    const fileDir = getFileDir(filename);
    const mp3Path = `${fileDir}/mp3/${clip_id}.mp3`;
    await extractMp3(filename, start, length, mp3Path);
    console.log(`${mp3Path}: ${length}s => ${fs.statSync(mp3Path).size} bytes`);

    const t = await transcribe(mp3Path);
    db.prepare(
      "INSERT INTO clips (id, movie_id, start, end, text) VALUES (?, ?, ?, ?, ?)",
    ).run(clip_id, movie_id, start, end, t.text);

    t.segments.forEach((s) =>
      db
        .prepare(
          ` INSERT INTO segments (movie_id, clip_id, start, end, text, seek, tokens, temperature, avg_logprob, compression_ratio, no_speech_prob)
          VALUES (@movie_id, @clip_id, @start, @end, @text, @seek, @tokens, @temperature, @avg_logprob, @compression_ratio, @no_speech_prob)`,
        )
        .run({
          movie_id,
          clip_id: clip_id,
          ...s,
          tokens: JSON.stringify(s.tokens),
        }),
    );
    t.words.forEach((w) =>
      db
        .prepare(
          "INSERT INTO words (movie_id, clip_id, start, end, word) VALUES (?, ?, ?, ?, ?)",
        )
        .run(movie_id, clip_id, w.start, w.end, w.word),
    );
    updateWordsSegmentId({ movie_id, clip_id });

    return {
      success: true,
      segments: selectSegments(db, movie_id, clip_id),
    };
  },
  delete: async ({ request }) => {
    const formData = await request.formData();
    const movie_id = Number(formData.get("id")!);
    db.prepare(`delete from words where movie_id=${movie_id}`).run();
    db.prepare(`delete from segments where movie_id=${movie_id}`).run();
    db.prepare(`delete from clips where movie_id=${movie_id}`).run();
    console.log(`Delete segments,words and clips for movie_id=${movie_id}`);
    return {
      success: true,
    };
  },
};
