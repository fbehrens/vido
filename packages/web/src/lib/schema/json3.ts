import * as S from "effect/Schema";
import { Segments } from "./Segments";

export class Event1 extends S.Class<Event1>("Event1")({
  tStartMs: S.Number,
  dDurationMs: S.Number,
  id: S.Number,
  wpWinPosId: S.Number,
  wsWinStyleId: S.Number,
}) {}

export class Seg extends S.Class<Seg>("Seg")({
  utf8: S.String,
  acAsrConf: S.optional(S.NullOr(S.Number)),
  tOffsetMs: S.optional(S.NullOr(S.Number)),
}) {}

export class Event extends S.Class<Event>("Event")({
  tStartMs: S.Number,
  dDurationMs: S.optional(S.Number),
  wWinId: S.Number,
  segs: S.optional(S.Array(Seg)),
  aAppend: S.optional(S.Number),
}) {}

export class Json3 extends S.Class<Json3>("Json3")({
  wireMagic: S.String,
  events: S.Tuple([Event1], Event),
}) {}

export const Json3Json = S.parseJson(Json3);

export const Json3Segmented = S.transform(Json3Json, Segments, {
  strict: true,
  decode: ({ events }) => {
    const [event1, ...event_] = events;
    const r = event_.map(({ tStartMs, dDurationMs, segs }, id) => {
      const start = tStartMs / 1000;
      const end = dDurationMs ? (tStartMs + dDurationMs) / 1000 : start;
      const text = segs?.map(({ utf8 }) => utf8).join("") ?? "";
      const words = segs
        ? segs.map(({ utf8, tOffsetMs }) => {
            const s = tOffsetMs ? start + tOffsetMs / 1000 : start;
            return { word: utf8, start: s, end: s };
          })
        : [];
      return { id, start, end, text, words };
    });
    return r;
  },
  encode: (segms) => segms as any,
});
