import * as S from "effect/Schema";
import { Letters, NonLetters } from "$lib/helper";
import { Segments } from "./Segments";
const Word = S.Struct({
  word: S.String,
  start: S.Number,
  end: S.Number,
});
export type Word = typeof Word.Type;
export const Segment = S.Struct({
  id: S.Number,
  //   seek: S.Number,
  start: S.Number,
  end: S.Number,
  text: S.String,
  // tokens: S.Array(S.Number),
  //temperature: S.Number,
  //avg_logprob: S.Number,
  // compression_ratio: S.Number,
  // no_speech_prob: S.Number,
});
export type Segment = typeof Segment.Type;

export const WhisperApi = S.Struct({
  text: S.String,
  segments: S.Array(Segment),
  words: S.Array(Word),
});
export type WhisperApi = typeof WhisperApi.Type;
export const WhisperApiJson = S.parseJson(WhisperApi);

export const WhisperApiSegmented = S.transform(WhisperApiJson, Segments, {
  strict: true,
  decode: ({ segments, words }) => {
    let words_editable = [...words];
    const pattern = new RegExp(`^\\s*[${Letters}]+[${NonLetters}]*`);
    const r = segments.map((segment) => {
      const segment_words = [];
      let text = segment.text;
      while (text.length > 0) {
        if (words.length == 0) throw new Error("running out ouf words");
        const word = words_editable.shift()!;
        const m = text.match(pattern);
        if (m == undefined) throw new Error(`cannot find pattern in "${text}"`);
        const ws_w_sp = m[0];
        if (!ws_w_sp.includes(word.word)) throw new Error(`"${word.word}" is not in "${ws_w_sp}"`);
        text = text.substring(ws_w_sp.length);
        segment_words.push({ ...word, word: ws_w_sp });
      }

      const segment_words_text = segment_words.map((w) => w.word).join("");
      if (segment_words_text != segment.text) {
        throw new Error(
          `Non matching text i segment ${segment.id}: "${segment.text}" != "${segment_words_text}"`,
        );
      }
      return { ...segment, words: segment_words };
    });
    return r;
  },
  encode: (segms) => segms as any,
});
