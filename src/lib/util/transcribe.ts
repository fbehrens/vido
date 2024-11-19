import { and, eq } from "drizzle-orm";
import { extractMp3, getDuration, getFramerate } from "$lib/ffmpeg";
import { db } from "$lib/server/db";
import { clips, movies } from "$lib/server/db/schema";
import { mp3Path } from "$lib/util/util.js";
import * as fs from "fs";
import { transcribe } from "$lib/whisper";
import type { Segment, Word } from "$lib/types";

export async function createMovie(
  filename: string,
): Promise<typeof movies.$inferSelect> {
  let m = await db.query.movies.findFirst({
    where: (movies, { eq }) => eq(movies.filename, filename),
  });
  let movie: typeof movies.$inferSelect;
  if (m) {
    movie = m;
  } else {
    movie = {
      filename,
      duration: await getDuration(`static/${filename}`),
      framerate: await getFramerate(`static/${filename}`),
    } as typeof movies.$inferSelect;
    const [{ id }] = await db.insert(movies).values(movie).returning();
    movie = { ...movie, id };
  }
  return movie;
}

export async function createTranscription(m: typeof movies.$inferSelect) {
  console.log(m);
  let cs = await getClips(m.id);
  if (cs.length === 0) {
    await createClips({
      duration: m.duration!,
      filename: m.filename,
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
    const segments = calcSegments({
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
    await db
      .update(movies)
      .set({ segments: c.segments })
      .where(eq(movies.id, c.movieId));
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

function calcSegments({
  id,
  start,
  transcript,
}: {
  id: number;
  start: number;
  transcript: string;
}): Segment[] {
  const t = JSON.parse(transcript);
  const rSplit = /^([\w'-]*?)(\W*)$/;

  const transscriptWords = t.words.map((s: any) => ({
    start: s.start + start,
    end: s.end + start,
    word: s.word,
  })) as Word[];
  const segments = t.segments.map((s: any, index: number) => {
    const words = s.text
      .trim()
      .split(/ |(?<=\w)-(?=\w)/) // seperated by blanks or hypehen between words
      .map((ws: string) => {
        const m = ws.match(rSplit);
        if (!m) {
          console.log(ws.match(/^([\w'-]*?)(\W*)$/));
          throw `${ws} not matchin ${rSplit}`;
        }
        const [wordS, sep] = [m[1], m[2]];
        if (wordS == "") {
          return {
            word: "",
            sep: sep,
            start: start + s.start,
            end: start + s.start + 0.1,
          };
        }
        const i = transscriptWords.findIndex((w) => w.word == wordS);
        const word = transscriptWords[i];
        if (i > -1) {
          word.sep = sep;
          transscriptWords.splice(i, 1);
        } else {
          console.error({
            message: "segment word not found in words",
            segmentStart: s.start,
            text: s.text,
            wordS: wordS,
          });
        }
        return word;
      });

    return {
      clip_id: id,
      start: s.start + start,
      end: s.end + start,
      text: s.text,
      words,
    };
  }) as Segment[];
  return segments;
}
