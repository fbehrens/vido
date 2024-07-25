import { describe, it, expect } from "vitest";
import {
  alignArrays,
  getWordWhitspace,
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
  it("works", () => {
    const s: WordItem[] = [
      {
        word: "A",
        id: 1,
      },
    ];
    const w = [
      {
        word: "A",
        id: 1,
        foo: 42,
      },
    ];
    expect(alignArrays(s, w)).toStrictEqual([s, w]);
  });
});
