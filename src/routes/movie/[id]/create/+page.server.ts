import { db } from "$lib/db";
import { extractMp3 } from "$lib/ffmpeg";
import type { Clip, Movie, Segment, Word } from "$lib/types";
import { getFileDir } from "$lib/util";
import { transcribe } from "$lib/whisper";
import * as fs from "fs";

export async function load({ params }) {
  const mp3Path = (m: Movie, clip_id: number): string => {
    const filename = `static/${m.filename}`;
    const fileDir = getFileDir(filename);
    return `${fileDir}/mp3/${clip_id}.mp3`;
  };
  const getClips = () =>
    db.prepare("select * from clips where movie_id = ?").all(id) as Clip[];
  const { id } = params;
  const movie = db
    .prepare("select * from movies where id = ?")
    .get(id) as Movie;
  let clips = getClips();
  console.log(movie);
  if (clips.length == 0) {
    console.log("create clips");
    const [maxClipLength, overlap] = [1450, 40];

    let clip_id = 0;
    let start = 0;
    let end: number;
    while (start < movie.duration) {
      end = start + maxClipLength + overlap;
      await extractMp3(
        `static/${movie.filename}`,
        start,
        end,
        mp3Path(movie, clip_id),
      );
      const fileSize = fs.statSync(mp3Path(movie, clip_id)).size;
      db.prepare(
        `INSERT INTO clips (id, movie_id, start, end,  filesize) VALUES (@clip_id, @id, @start, @end, @fileSize)`,
      ).run({
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
    await toTranscribe.forEach(async (c) => {
      console.log({ clip_id: c.id, action: `call whisper` });
      const t = await transcribe(mp3Path(movie, c.id));
      const transcript = JSON.stringify(t);
      db.prepare(
        `UPDATE clips set transcript = @transcript where movie_id = @id and id= @clip_id`,
      ).run({ transcript, id, clip_id: c.id });
    });
    clips = getClips();
  }

  const toSegments = clips.filter((c) => !c.segments);
  if (toSegments.length) {
    toSegments.forEach((c) => {
      console.log({ clip_id: c.id, action: `calculate segments for ` });
      const segments = calcSegments(c);
      db.prepare(
        "update clips set segments = ? where id = ? and movie_id = ?",
      ).run(JSON.stringify(segments), c.id, id);
    });
    console.log("loaded");
    clips = getClips();
  }
  return { movie, clips };
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
