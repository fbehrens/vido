import * as S from "effect/Schema";

const Word = S.Struct({
  word: S.String,
  start: S.Number,
  end: S.Number,
});

export const Segments = S.Array(
  S.Struct({
    start: S.Number,
    end: S.Number,
    text: S.String,
    words: S.Array(Word),
  }),
);
