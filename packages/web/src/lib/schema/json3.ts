import * as S from "effect/Schema";

// export class WsWinStyle extends S.Class<WsWinStyle>("WsWinStyle")({
//   mhModeHint: S.optional(S.NullOr(S.Number)),
//   juJustifCode: S.optional(S.NullOr(S.Number)),
//   sdScrollDir: S.optional(S.NullOr(S.Number)),
// }) {}

// export class WpWinPosition extends S.Class<WpWinPosition>("WpWinPosition")({
//   apPoint: S.optional(S.NullOr(S.Number)),
//   ahHorPos: S.optional(S.NullOr(S.Number)),
//   avVerPos: S.optional(S.NullOr(S.Number)),
//   rcRows: S.optional(S.NullOr(S.Number)),
//   ccCols: S.optional(S.NullOr(S.Number)),
// }) {}

// export class Pen extends S.Class<Pen>("Pen")({}) {}

export class Seg extends S.Class<Seg>("Seg")({
  utf8: S.String,
  acAsrConf: S.optional(S.NullOr(S.Number)),
  tOffsetMs: S.optional(S.NullOr(S.Number)),
}) {}

export class Event extends S.Class<Event>("Event")({
  tStartMs: S.Number,
  dDurationMs: S.optional(S.NullOr(S.Number)),
  id: S.optional(S.NullOr(S.Number)),
  wpWinPosId: S.optional(S.NullOr(S.Number)),
  wsWinStyleId: S.optional(S.NullOr(S.Number)),
  wWinId: S.optional(S.NullOr(S.Number)),
  segs: S.optional(S.NullOr(S.Array(Seg))),
  aAppend: S.optional(S.NullOr(S.Number)),
}) {}

export class Json3 extends S.Class<Json3>("Json3")({
  wireMagic: S.String,
  //   pens: S.Array(Pen),
  //   wsWinStyles: S.Array(WsWinStyle),
  //   wpWinPositions: S.Array(WpWinPosition),
  events: S.Array(Event),
}) {}

export const Json3Json = S.parseJson(Json3);
