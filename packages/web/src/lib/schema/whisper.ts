import * as S from "effect/Schema";

export class Word extends S.Class<Word>("Word")({
  word: S.String,
  start: S.Number,
  end: S.Number,
  probability: S.Number,
}) {}

export class Segment extends S.Class<Segment>("Segment")({
  id: S.Number,
  seek: S.Number,
  start: S.Number,
  end: S.Number,
  text: S.String,
  tokens: S.Array(S.Number),
  temperature: S.Number,
  avg_logprob: S.Number,
  compression_ratio: S.Number,
  no_speech_prob: S.Number,
  words: S.Array(Word),
}) {}

export class Whisper extends S.Class<Whisper>("Whisper")({
  text: S.String,
  segments: S.Array(Segment),
  language: S.String,
}) {}

export const WhisperJson = S.parseJson(Whisper);
