import { json } from "stream/consumers";
import { exec } from "./util/util";
import { z } from "zod";

export async function ytGetInfo(id: string): Promise<string> {
  const info = await exec(
    `yt-dlp --skip-download --dump-json https://www.youtube.com/watch?v=${id}`,
  );
  return info.out;
}

export function ytGetId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    if (hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }

    if (hostname === "www.youtube.com" || hostname === "youtube.com") {
      if (urlObj.searchParams.has("v")) {
        return urlObj.searchParams.get("v");
      }

      if (urlObj.pathname.startsWith("/embed/")) {
        return urlObj.pathname.slice(7);
      }
    }

    return null;
  } catch (error) {
    return url;
  }
}

const format = z.object({
  format_id: z.string(),
  format_note: z.string(),
  ext: z.string(),
  protocol: z.string(),
  acodec: z.string(),
  vcodec: z.string(),
  url: z.string(),
  width: z.number(),
  height: z.number(),
  fps: z.number(),
  rows: z.number(),
  columns: z.number(),
  fragments: z.array(z.object({ url: z.string(), duration: z.number() })),
  resolution: z.string(),
  aspect_ratio: z.number(),
  filesize_approx: z.null(),
  http_headers: z.object({
    "User-Agent": z.string(),
    Accept: z.string(),
    "Accept-Language": z.string(),
    "Sec-Fetch-Mode": z.string(),
  }),
  audio_ext: z.string(),
  video_ext: z.string(),
  vbr: z.number(),
  abr: z.number(),
  tbr: z.null(),
  format: z.string(),
});

const caption = z.object({
  ext: z.string(),
  url: z.string(),
  name: z.string(),
});

const automatic_captions = z.record(z.string(), z.array(caption));
const chapter = z.object({
  start_time: z.number(),
  title: z.string(),
  end_time: z.number(),
});
const schema = z.object({
  id: z.string(),
  title: z.string(),
  //   formats: z.array(format),
  description: z.string(),
  channel: z.string(),
  like_count: z.number(),
  fulltitle: z.string(),
  duration: z.number(), // seconds
  duration_string: z.string(),
  chapters: z.array(chapter),
  epoch: z.number(),
  automatic_captions,
});

export class YtInfo {
  json: z.infer<typeof schema>;
  constructor(s: string) {
    const o = JSON.parse(s);
    this.json = schema.parse(o); //
  }
}
