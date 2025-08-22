import { describe, test, expect } from "vitest";
import { json3Schema, ytInfoZod, get_json3_url } from "./yt";
import { readFixture } from "./server/utils";

describe("yt.ts", () => {
  test("YtInfo", () => {
    const yt = ytInfoZod(readFixture("test/fixtures/youtube_info.json"));
    // console.log(ytInfo.json);
    expect(yt.id).toBe("o1JgW_4MTWI");
    // show_captions(yt);
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
