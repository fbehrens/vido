import { describe, it, expect } from "vitest";
import { overlay } from "./overlapClips";
import type { Clip, Duration } from "$lib/types";
describe("overlayClips", () => {
  it("works", () => {
    let clips: Clip[] = [
      { id: 1, start: 0, end: 4, text: "" },
      { id: 2, start: 3, end: 5, text: "" },
    ];
    let r;
    r = [...overlay(clips.slice(0, 1))];
    expect(r).toStrictEqual([{ ids: [1], start: 0, end: 4 }]);

    r = [...overlay(clips.slice(0, 2))];
    expect(r[0]).toStrictEqual({ start: 0, end: 3, ids: [1] });
    expect(r[1]).toStrictEqual({ start: 3, end: 4, ids: [1, 2] });
    expect(r[2]).toStrictEqual({ start: 4, end: 5, ids: [2] });
  });
});
