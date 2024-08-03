import { db } from "$lib/db";
import type { Clip, Movie, Segment, Word } from "$lib/types";

export function load({ params }) {
  const { id } = params;
  const movie = db
    .prepare("select * from movies where id = ?")
    .get(id) as Movie;
  const clips = db
    .prepare("select * from clips where movie_id = ?")
    .all(id) as Clip[];
  console.log(movie);
  if (clips.length == 0) {
    console.log("create clips");
  }
  clips
    .filter((c) => !c.transcript)
    .forEach((c) => {
      console.log({ action: "call whisper api" });
    });

  clips
    .filter((c) => !c.segments)
    .forEach((c) => {
      console.log({ action: "calculate segments", id: c.id });
      const segments = calcSegments(c);
      db.prepare("update clips set segments = ? where id = ? ").run(
        JSON.stringify(segments),
        c.id,
      );
    });

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

  const words = t.words.map((s: any) => ({
    start: s.start + start,
    end: s.end + start,
    word: s.word,
  })) as Word[];
  const segments = t.segments.map((s: any, index: number) => {
    const segWords = s.text
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
            start: s.start,
            end: s.start + 0.1,
          };
        }
        const i = words.findIndex((w) => w.word == wordS);
        const word = words[i];
        if (i > -1) {
          word.sep = sep;
          words.splice(i, 1);
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
