import { z } from "zod";

const whisperApiWordsSchema = z.object({ word: z.string(), start: z.number(), end: z.number() });
export const whisperApiSchema = z.object({
  text: z.string(),
  segments: z.array(
    z.object({
      id: z.number(),
      start: z.number(),
      end: z.number(),
      text: z.string(),
    }),
  ),
  words: z.array(whisperApiWordsSchema),
});

export const whisperApiSegmentedSchema = z.array(
  z.object({
    start: z.number(),
    end: z.number(),
    text: z.string(),
    words: z.array(
      z.object({
        start: z.number(),
        end: z.number(),
        word: z.string(),
        sep: z.string(),
      }),
    ),
  }),
);

export function whisperApi(s: string): z.infer<typeof whisperApiSchema> {
  const o = JSON.parse(s);
  return whisperApiSchema.parse(o);
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
  name: z.string().optional(),
});

const automatic_captions = z.record(z.string(), z.array(caption));

const chapter = z.object({
  start_time: z.number(),
  title: z.string(),
  end_time: z.number(),
});

export const ytInfoSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    //   formats: z.array(format),
    language: z.string().nullable(),
    description: z.string(),
    channel: z.string(),
    like_count: z.number(),
    fulltitle: z.string(),
    duration: z.number(), // seconds
    duration_string: z.string(),
    chapters: z.array(chapter).nullable(),
    epoch: z.number(),
    automatic_captions,
  })
  .transform((o) => ({
    ...o,
    chapters: o.chapters ?? [],
  }));
