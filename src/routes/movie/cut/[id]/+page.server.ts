import { dbOld } from "$lib/db";
import { extractMp3, getDuration, getFramerate } from "$lib/ffmpeg";
import { db } from "$lib/server/db/index.js";
import { movies } from "$lib/server/db/schema.js";
import type { Clip, Movie, Segment, Word } from "$lib/types";
import { getClips } from "$lib/util/transcribe";
import { mp3Path } from "$lib/util/util";
import { transcribe } from "$lib/whisper";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as fs from "fs";

export async function load({ params }) {
  let { id } = params;

  const movie = await db.select().from(movies).where(eq(movies.id, id)).get();
  if (!movie) throw new Error("Movie not found");
  const clps = await getClips(movie.id);
  return { movie, clps };
}

export const actions = {
  default: async ({ cookies, request }) => {
    const fd = await request.formData();
    const cut = fd.getAll("cut") as unknown as number[];
    const movie_id = fd.get("movie_id") as unknown as number;
    joinClips(cut, movie_id);
    redirect(303, `/movie/${movie_id}`);
  },
};

function joinClips(cut: number[], movie_id: number) {
  const filterSeg = (wordFn: (w: { start: number }) => boolean) => {
    return (seg) => {
      if (seg.words.every(wordFn)) {
        return seg;
      } else if (seg.words.some(wordFn)) {
        const words = seg.words.filter(wordFn);
        return {
          text: seg.text,
          words,
          start: Math.min(...words.map((w) => w.start)),
          end: Math.max(...words.map((w) => w.end)),
        };
      } else {
        return undefined;
      }
    };
  };
  const clips = dbOld
    .prepare("select id,segments from clips where movie_id = ? order by id")
    .all(movie_id)
    .map((s: any, index) => {
      console.assert(s.id == index);
      const segs = JSON.parse(s.segments);
      segs.forEach((s) => delete s.clip_id);
      return segs;
    });

  cut.forEach((time, index) => {
    clips[index] = clips[index]
      .map(filterSeg((word: any) => word.start <= time))
      .filter((s) => s);
    clips[index + 1] = clips[index + 1]
      .map(filterSeg((word: any) => word.start > time))
      .filter((s) => s);
  });
  const segments = clips.flatMap((c) => c);
  console.log(segments.length);
  dbOld
    .prepare("update movies set segments= ? where id = ?")
    .run(JSON.stringify(segments), movie_id);
}
