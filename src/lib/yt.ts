import { z } from "zod";
import { ytInfoSchema } from "./zod-schema";

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

function applySchema(s: string, schema: z.ZodSchema<any>) {
  const o = JSON.parse(s);
  try {
    return schema.parse(o);
  } catch (e) {
    console.log({ err: `error parsing zodSchema ${schema}`, s });
    throw e;
  }
}
export function ytInfo(s: string): z.infer<typeof ytInfoSchema> {
  return applySchema(s, ytInfoSchema);
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

const js3Event = z
  .object({
    tStartMs: z.number(),
    dDurationMs: z.number().optional(),
    wWinId: z.number(),
    aAppend: z.number().optional(),
    segs: z.array(js3Seg).optional(),
  })
  .transform((o) => ({
    ...o,
    segs: o.segs ?? [],
  }));

const js3Schema = z.object({
  wireMagic: z.string(),
  events: z.tuple([js3Event1]).rest(js3Event),
});

export function json3(s: string): z.infer<typeof js3Schema> {
  const o = JSON.parse(s);
  return js3Schema.parse(o);
}
