import { db } from "$lib/db";
import type { Clip, Movie, Segment, Word } from "$lib/types.js";
import { getFileDir } from "$lib/util";
import { extractMp3 } from "$lib/ffmpeg.js";
import { transcribe } from "$lib/whisper";
import * as fs from "fs";

export async function load({ params }) {
  console.log({ serverload: params });
  const { id } = params;
  const movie = db
    .prepare("Select * FROM movies where id = ?")
    .get(id) as Movie;
  console.log(movie);
  return { movie, ...getTranscript(movie) };
}

function getTranscript({ id }: { id: number }) {
  const clips = db
    .prepare(
      "SELECT id, start, end, text,transcript FROM clips WHERE movie_id = ? order by id",
    )
    .all(id) as Clip[];
  const segments: Segment[] = [];
  const words: Word[] = [];
  clips.forEach((c) => {
    const transcript = JSON.parse(c.transcript);
    transcript.segments.forEach((s: any) =>
      segments.push({
        start: s.start + c.start,
        end: s.end + c.start,
        text: s.text,
        clip_id: c.id,
      } as Segment),
    );
    transcript.words.forEach((s: any) =>
      words.push({
        start: s.start + c.start,
        end: s.end + c.start,
        word: s.word,
        clip_id: c.id,
      } as Word),
    );
  });
  console.log(segments, words);
  return {
    clips,
    segments,
    words,
  };
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
    const transcript = JSON.stringify(t);
    db.prepare(
      `INSERT INTO clips (id, movie_id, start, end, text, filesize, transcript) VALUES (@clip_id, @movie_id, @start, @end, @text, @fileSize, @transcript)`,
    ).run({
      clip_id,
      movie_id,
      start,
      end,
      text: t.text,
      fileSize,
      transcript,
    });

    // updateWordsSegmentId({ movie_id, clip_id });

    return {
      success: true,
      ...getTranscript({ id: movie_id }),
    };
  },
};
