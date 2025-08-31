import { describe, test, expect } from "vitest";
import { YouTubeVideoId } from "./yt";
import * as S from "effect/Schema";

describe("yt.ts", () => {
  test("YouTubeVideoId", () => {
    const id = "o1JgW_4MTWI";
    const decode = S.decodeSync(YouTubeVideoId);
    expect(decode(id)).toBe(id);
    expect(decode(`https://www.youtube.com/watch?v=${id}`)).toBe(id);
    expect(decode(`https://youtu.be/${id}`)).toBe(id);
    expect(() => {
      decode("invalid-id");
    }).toThrow("Invalid URL");
  });
});
