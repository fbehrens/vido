import { db } from "$lib/db";
import type { Clip, Movie, Segment, Word } from "$lib/types.js";
import { getFileDir, makeDirFor } from "$lib/util";
import { createMovie, selectSegmentsByClip } from "$lib/sqlite.js";
import { getDuration, extractMp3 } from "$lib/ffmpeg.js";
import { transcribe } from "$lib/whisper";
import * as fs from "fs";
import { alignArrays, updateWordsSegmentId } from "$lib/util/alignArrays";

function getTranscript({ id }: { id: number }) {
  return {
    clips: db
      .prepare("SELECT id, start, end, text FROM clips WHERE movie_id = ?")
      .all(id) as Clip[],
    segments: db
      .prepare(
        "SELECT clip_id, start, end, text, id FROM segments_v WHERE movie_id = ? ORDER BY start",
      )
      .all(id) as Segment[],
    words: db
      .prepare(
        "SELECT id, clip_id, segment_id, start, end, word FROM words_v WHERE movie_id = ?",
      )
      .all(id) as Word[],
  };
}

export async function load({ params }) {
  console.log({ serverload: params });
  const { filename } = params;
  const movie =
    (db
      .prepare("Select * FROM movies where filename = ?")
      .get(filename) as Movie) ||
    createMovie(db, {
      filename,
      duration: await getDuration(`static/${filename}`),
    });
  console.log(movie);
  return { movie, ...getTranscript(movie) };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const actions = {
  // clip: id,start,end -> db + mp3 -> whisper -> segments+ words
  whisper: async ({ request }) => {
    const formData = await request.formData();
    const movie_id = Number(formData.get("id")!);
    const start = Number(formData.get("start")!);
    const length = Number(formData.get("length")!);
    const end = Number(formData.get("end")!);

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

    const fileSize = fs.statSync(mp3Path).size;
    console.log(`${mp3Path}: ${length}s => ${fileSize} bytes`);
    if (fileSize > 25000000) {
      return {
        ...getTranscript({ id: movie_id }),
        success: true,
      };
    }

    const t = await transcribe(mp3Path);
    db.prepare(
      "INSERT INTO clips (id, movie_id, start, end, text, filesize) VALUES (?, ?, ?, ?, ?, ?)",
    ).run(clip_id, movie_id, start, end, t.text, fileSize);

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
      ...getTranscript({ id: movie_id }),
    };
  },
};
