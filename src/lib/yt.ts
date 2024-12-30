import { z } from "zod";

export function ytGetId(url: string): string | null {
  if (url.length === 11) return url;
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

const ytInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
  //   formats: z.array(format),
  language: z.string(),
  description: z.string(),
  channel: z.string(),
  like_count: z.number(),
  fulltitle: z.string(),
  duration: z.number(), // seconds
  duration_string: z.string(),
  chapters: z.array(chapter).nullable(),
  epoch: z.number(),
  automatic_captions,
});

export class YtInfo {
  json: z.infer<typeof ytInfoSchema>;
  constructor(s: string) {
    const o = JSON.parse(s);
    try {
      this.json = ytInfoSchema.parse(o);
    } catch (error) {
      this.json = {} as z;
      console.log({ error, o });
    }
  }
}

const js3Event1 = z.object({
  tStartMs: z.number(),
  dDurationMs: z.number(),
  id: z.number(),
  wpWinPosId: z.number(),
  wsWinStyleId: z.number(),
});

const js3Seg = z.object({
  utf8: z.string(),
  tOffsetMs: z.number().optional(),
  acAsrConf: z.number().optional(),
});

const js3Event = z.object({
  tStartMs: z.number(),
  dDurationMs: z.number().optional(),
  wWinId: z.number(),
  aAppend: z.number().optional(),
  segs: z.array(js3Seg).optional(),
});

const js3 = z.object({
  wireMagic: z.string(),
  events: z.tuple([js3Event1]).rest(js3Event),
});

export function json3(s: string): z.infer<typeof js3> {
  const o = JSON.parse(s);
  return js3.parse(o);
}
