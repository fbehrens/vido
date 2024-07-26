import { describe, test, expect } from "vitest";
import { alignArrays, wordSep, type WordItem } from "./alignArrays";
describe("alignArrays", () => {
  test("wordSep", () => {
    expect(wordSep(" a.")).toStrictEqual([{ word: "a", sep: "." }]);
  });
  test("works", () => {
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
    expect(alignArrays(s, w)).toStrictEqual([
      { word: "a", id: 1, id1: 1 },
      { word: "b", id: 2 },
      { word: "c", id: 3, id1: 3 },
    ]);
  });
});
