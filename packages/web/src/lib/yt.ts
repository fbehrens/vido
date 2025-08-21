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

type YtInfoSchema = z.infer<typeof ytInfoSchema>;
export function ytInfoZod(s: string): YtInfoSchema {
  return applySchema(s, ytInfoSchema);
}

export function show_captions(info: YtInfoSchema) {
  for (const [lang, captions] of Object.entries(info.automatic_captions)) {
    let out = `${lang} (${captions[0].name}): `;
    for (const caption of captions) {
      out += caption.ext + " ";
    }
    console.log(out);
  }
}

export function get_json3_url(info: YtInfoSchema, lang?: string) {
  const automatic_captions = info.automatic_captions;
  const available_langs = Object.keys(automatic_captions);
  const orig = available_langs.find((s) => s.endsWith("-orig"));
  const selected_lang =
    [lang, orig, "de", "en"].find((l): l is string => l !== undefined && l in automatic_captions) ??
    available_langs[0];
  const captions = automatic_captions[selected_lang];
  const exts = captions.map((c) => c.ext);
  //   console.log({ available_langs, selected_lang, exts });
  const json3 = captions.find((c) => c.ext === "json3");
  if (json3) {
    return json3.url;
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

export function json3Schema(s: string): z.infer<typeof js3Schema> {
  const o = JSON.parse(s);
  return js3Schema.parse(o);
}
