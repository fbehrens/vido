import { describe, test, expect } from "vitest";
import { json3Schema, ytInfoZod, get_json3_url, YouTubeVideoId } from "./yt";
import { readFixture } from "./server/utils";
import * as S from "effect/Schema";

describe("yt.ts", () => {
  test("YouTubeVideoId", () => {
    const id = "o1JgW_4MTWI";
    const decode = S.decodeSync(YouTubeVideoId);
    expect(decode(id)).toBe(id);
    expect(decode(`https://www.youtube.com/watch?v=${id}`)).toBe(id);
    expect(decode(`https://youtu.be/${id}`)).toBe(id);
    expect(decode(`https://youtu.be/${id}`)).toBe(id);
    expect(() => {
      decode("invalid-id");
    }).toThrow("Invalid URL");
  });

  test("YtInfo", () => {
    const yt = ytInfoZod(readFixture("test/fixtures/youtube_info.json"));
    expect(yt.id).toBe("o1JgW_4MTWI");
    const caption = get_json3_url(yt);
    expect(caption).toMatchSnapshot();
  });

  test("json3", () => {
    const s = readFixture("test/fixtures/youtube_json3.json");
    const o = json3Schema(s);
    // console.log(o.events[2]);
    expect(o.wireMagic).toBe("pb3");
  });
});
