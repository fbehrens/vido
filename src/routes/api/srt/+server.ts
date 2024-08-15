import { db } from "$lib/db";
import type { Segment } from "$lib/types";
import { json, type RequestEvent } from "@sveltejs/kit";
type Unit = "word" | "segment";
export async function GET(event: RequestEvent) {
  const id = event.url.searchParams.get("id");
  const clip_id = event.url.searchParams.get("clip_id");
  const unit = event.url.searchParams.get("unit") as Unit;
  //   const filename = clip_id ? `${id}_${clip_id}.srt` : `${id}.srt`;
  const filename = `${id}_${clip_id}_${unit}.srt`;
  const { segments } = (
    clip_id
      ? db
          .prepare("select segments from clips where movie_id=? and id=?")
          .get(id, clip_id)
      : db.prepare("select segments from movies where id=?").get(id)
  ) as { segments: string };
  const segs = JSON.parse(segments) as Segment[];
  const timestamps =
    unit === "word"
      ? segs
          .flatMap((s) => s.words)
          .map(({ start, end, word, sep }) => ({
            start,
            end,
            text: word + sep,
          }))
      : segs.map(({ start, end, text }) => ({ start, end, text }));
  //   return json({ filename, ts: timestamps[0] });
  const srt = createSrt(timestamps);
  const headers = new Headers();
  headers.append("Content-Type", "text/plain");
  headers.append("Content-Disposition", `attachment; filename="${filename}"`);
  return new Response(srt, {
    status: 200,
    headers: headers,
  });
}

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

function createSrt(timestamps: Subtitle[]): string {
  let srtContent = "";
  timestamps.forEach((subtitle, index) => {
    const sequenceNumber = index + 1;
    const startTime = formatTime(subtitle.start);
    const endTime = formatTime(subtitle.end);

    srtContent += `${sequenceNumber}\n`;
    srtContent += `${startTime} --> ${endTime}\n`;
    srtContent += `${subtitle.text}\n\n`;
  });
  return srtContent;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)},${padZero(milliseconds, 3)}`;
}

function padZero(num: number, length: number = 2): string {
  return num.toString().padStart(length, "0");
}
