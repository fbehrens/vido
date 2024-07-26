import { describe, test, expect } from "vitest";
import {
  alignArrays,
  getWordWhitspace,
  wordSep,
  type WordItem,
} from "./alignArrays";
describe("alignArrays", () => {
  test("wordWhitespace", () => {
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
  test("wordSep", () => {
    expect([...wordSep(" a.")]).toStrictEqual([{ word: "a", sep: "." }]);
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
    // expect(1).toBe(2);
    // expect(alignArrays(s, w)).toStrictEqual([s, w]);
    expect(alignArrays(s, w)).toStrictEqual([
      { word: "a", id: 1, id1: 1 },
      { word: "b", id: 2 },
      { word: "c", id: 3, id1: 3 },
    ]);
  });
});
