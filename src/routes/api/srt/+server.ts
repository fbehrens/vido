import { dbOld } from "$lib/db";
import { db } from "$lib/server/db";
import type { Segment } from "$lib/types";
import { whisperApi } from "$lib/zod-schema";
import { json, type RequestEvent } from "@sveltejs/kit";
type CaptionTyp = "srt" | "vtt";
export async function GET(event: RequestEvent) {
  const id = event.url.searchParams.get("id")!;
  const captionTyp = event.url.searchParams.get("typ") as CaptionTyp;
  const m = (await db.query.movies.findFirst({
    columns: {
      id: true,
      filename: true,
    },
    where: (movies, { eq }) => eq(movies.id, parseInt(id)),
    with: {
      captions: {
        where: (captions, { eq }) => eq(captions.typ, "whisper_api"),
        columns: {
          typ: true,
          data: true,
        },
      },
    },
  }))!;
  const wa = whisperApi(m.captions[0]!.data!);
  const timestamps = wa.map(({ start, end, text }) => ({ start, end, text }));
  const captions = createCaption(captionTyp, timestamps);
  const filename = m.filename!.replace(/\.[^/.]+$/, `.${captionTyp}`);
  const headers = new Headers();
  headers.append("Content-Type", "text/plain");
  headers.append("Content-Disposition", `attachment; filename="${filename}"`);
  return new Response(captions, {
    status: 200,
    headers: headers,
  });
}

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

function createCaption(typ: CaptionTyp, timestamps: Subtitle[]): string {
  console.log(timestamps.slice(0, 9));
  let [srtContent, fractionChar] =
    typ === "vtt" ? ["WEBVTT\n\n", "."] : ["", ","];

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}${fractionChar}${padZero(milliseconds, 3)}`;
  }

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

function padZero(num: number, length: number = 2): string {
  return num.toString().padStart(length, "0");
}
