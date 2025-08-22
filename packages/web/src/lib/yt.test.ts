import { describe, test, expect } from "vitest";
import { json3Schema, ytInfoZod, get_json3_url, ytGetId } from "./yt";
import { readFixture } from "./server/utils";

describe("yt.ts", () => {
  test("ytGetId", () => {
    const id = "o1JgW_4MTWI";
    expect(ytGetId(id)).toBe(id);
    expect(ytGetId(`https://www.youtube.com/watch?v=${id}`)).toBe(id);
    expect(ytGetId(`https://youtu.be/${id}`)).toBe(id);
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
