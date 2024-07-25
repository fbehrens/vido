import { describe, it, expect } from "vitest";
import {
  alignArrays,
  getWordWhitspace,
  mergeWords,
  wordSep,
  type WordItem,
} from "./alignArrays";
describe("alignArrays", () => {
  it("wordWhitespace", () => {
    expect(getWordWhitspace("a.")).toStrictEqual([{ word: "a", sep: "." }, ""]);
    expect(getWordWhitspace("a.b")).toStrictEqual([
      { word: "a", sep: "." },
      "b",
    ]);
    expect(getWordWhitspace("it's. b")).toStrictEqual([
      { word: "it's", sep: ". " },
      "b",
    ]);
    expect(getWordWhitspace("a")).toStrictEqual([{ word: "a", sep: " " }, ""]);
  });
  it("wordSep", () => {
    expect([...wordSep("a.")]).toStrictEqual([{ word: "a", sep: "." }]);
  });
  it("mergeWords", () => {
    expect(mergeWords({ word: "a", a: 1 }, { word: "a", b: 2 })).toStrictEqual({
      word: "a",
      a: 1,
      b: 2,
    });
  });
  it("works", () => {
    const s: WordItem[] = [
      {
        word: "a",
        id: 1,
      },
      {
        word: "b",
        id: 2,
      },
      {
        word: "c",
        id: 3,
      },
    ];
    const w = [
      {
        word: "a",
        id1: 1,
      },
      {
        word: "c",
        id1: 3,
      },
    ];
    // expect(1).toBe(2);
    // expect(alignArrays(s, w)).toStrictEqual([s, w]);
    alignArrays(s, w);
  });
});
