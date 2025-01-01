import { z } from "zod";

export const whisperApiSchema = z.array(
  z.object({
    clip_id: z.number(),
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
