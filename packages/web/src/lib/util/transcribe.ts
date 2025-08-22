import { and, eq } from "drizzle-orm";
import { extractMp3, getDuration, getFramerate } from "$lib/ffmpeg";
import { db } from "$lib/server/db";
import { movies } from "$lib/server/db/schema/vido";
import { mp3Path } from "$lib/server/utils";
import * as fs from "fs";
import { transcribe } from "$lib/whisper";
import type { Segment, Word } from "$lib/types";
import type z from "zod";

export async function createTranscription(m: typeof movies.$inferSelect) {
  console.log(m);
  let cs = await getClips(m.id);
  if (cs.length === 0) {
    await createClips({
      duration: m.duration!,
      filename: m.filename!,
      movieId: m.id,
    });
  }
  // transcribe
  cs = await getClips(m.id);
  for (const c of cs.filter((c) => !c.transcript)) {
    const transcript = await transcribe("static/" + c.filename);
    await db
      .update(clips)
      .set({ transcript: JSON.stringify(transcript) })
      .where(and(eq(clips.id, c.id), eq(clips.movieId, c.movieId)));
  }

  // calculate segments
  cs = await getClips(m.id);
  for (const c of cs.filter((c) => !c.segments)) {
    console.log("calculating segments for clip", c.id);
    const segments = calcSegmentsOld({
      id: c.id,
      start: c.start,
      transcript: c.transcript!,
    });
    await db
      .update(clips)
      .set({ segments: JSON.stringify(segments) })
      .where(and(eq(clips.id, c.id), eq(clips.movieId, c.movieId)));
  }

  const [c, ...rest] = await getClips(m.id);
  if (!rest.length) {
    await db.update(movies).set({ segments: c.segments }).where(eq(movies.id, c.movieId));
    return true;
  } else {
    return false; // cutt is required
  }
}

export async function getClips(movieId: number) {
  return await db.select().from(clips).where(eq(clips.movieId, movieId));
}

export async function createClips({
  duration,
  filename,
  movieId,
}: {
  duration: number;
  filename: string;
  movieId: number;
}) {
  const [maxClipLength, overlap] = [1450, 40];
  let id = 0;
  let start = 0;
  let end: number;
  while (start < duration) {
    end = start + maxClipLength + overlap;
    const mp3file = mp3Path(filename, id);
    await extractMp3(`static/${filename}`, start, end, "static/" + mp3file);
    const filesize = fs.statSync("static/" + mp3file).size;
    const [c] = await db
      .insert(clips)
      .values({ movieId, id, start, end, filesize, filename: mp3file })
      .returning();
    start += maxClipLength;
    id++;
  }
}

export function waToString(wa: z.infer<typeof whisperApiSchema>) {
  const segments = wa.segments.map((s) => s.text).join("|");
  const words = wa.words.map((w) => w.word).join("|");
  return [wa.text, segments, words];
}
