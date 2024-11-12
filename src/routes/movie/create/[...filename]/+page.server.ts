import { dbOld } from "$lib/db";
import { extractMp3, getDuration, getFramerate } from "$lib/ffmpeg";
import type { Clip, Movie, Segment, Word } from "$lib/types";
import { mp3Path } from "$lib/util/util";
import { transcribe } from "$lib/whisper";
import { redirect } from "@sveltejs/kit";
import * as fs from "fs";

export async function load({ params }) {
  let { filename } = params;
  dbOld
    .prepare(
      "INSERT OR IGNORE INTO movies (filename,duration,framerate) VALUES (?,?,?)",
    )
    .run(
      filename,
      await getDuration(`static/${filename}`),
      await getFramerate(`static/${filename}`),
    );
  throw "ff";
  const { id } = dbOld
    .prepare("select id from movies where filename=?")
    .get(filename) as { id: number };

  const movie = dbOld
    .prepare("select * from movies where id = ?")
    .get(id) as Movie;
  const getClips = () =>
    dbOld.prepare("select * from clips where movie_id = ?").all(id) as Clip[];
  let clips = getClips();
  if (clips.length == 0) {
    console.log("create clips");
    const [maxClipLength, overlap] = [1450, 40];
    let clip_id = 0;
    let start = 0;
    let end: number;
    while (start < movie.duration) {
      end = start + maxClipLength + overlap;
      const mp3file = "static/" + mp3Path(movie.filename, clip_id);
      await extractMp3(`static/${movie.filename}`, start, end, mp3file);
      const fileSize = fs.statSync(mp3file).size;
      dbOld
        .prepare(
          `INSERT INTO clips (id, movie_id, start, end,  filesize) VALUES (@clip_id, @id, @start, @end, @fileSize)`,
        )
        .run({
          clip_id,
          id,
          start,
          end,
          fileSize,
        });
      start += maxClipLength;
      clip_id++;
    }
    clips = getClips();
  }
  const toTranscribe = clips.filter((c) => !c.transcript);
  if (toTranscribe.length) {
    for (const c of toTranscribe) {
      console.log({ clip_id: c.id, action: `call whisper` });
      const t = await transcribe("static/" + mp3Path(movie.filename, c.id));
      const transcript = JSON.stringify(t);
      dbOld
        .prepare(
          `UPDATE clips set transcript = @transcript where movie_id = @id and id= @clip_id`,
        )
        .run({ transcript, id, clip_id: c.id });
    }
    clips = getClips();
  }

  const toSegments = clips.filter((c) => !c.segments);
  if (toSegments.length) {
    toSegments.forEach((c) => {
      console.log({ clip_id: c.id, action: `calculate segments for ` });
      const segments = calcSegments(c);
      dbOld
        .prepare("update clips set segments = ? where id = ? and movie_id = ?")
        .run(JSON.stringify(segments), c.id, id);
    });
    console.log("loaded");
    clips = getClips();
  }
  return { movie, clips };
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

function calcSegments({
  id,
  start,
  end,
  transcript,
}: {
  id: number;
  start: number;
  end: number;
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
