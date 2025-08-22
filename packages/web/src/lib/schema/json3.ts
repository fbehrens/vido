import * as S from "effect/Schema";

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

export class Event1 extends S.Class<Event1>("Event1")({
  tStartMs: S.Number,
  dDurationMs: S.Number,
  id: S.Number,
  wpWinPosId: S.Number,
  wsWinStyleId: S.Number,
}) {}

export class Json3 extends S.Class<Json3>("Json3")({
  wireMagic: S.String,
  events: S.Tuple([Event1], Event),
}) {}

export const Json3Json = S.parseJson(Json3);
