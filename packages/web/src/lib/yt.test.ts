import { describe, test, expect } from "vitest";
import { json3, ytInfo, get_json3_url } from "./yt";
import { readFixture } from "./utils";

describe("yt.ts", () => {
  test("YtInfo", () => {
    const yt = ytInfo(readFixture("test/fixtures/youtube_info.json"));
    // console.log(ytInfo.json);
    expect(yt.id).toBe("rg7Fvvl3taU");
    // show_captions(yt);
    const caption = get_json3_url(yt);
    expect(caption).toMatchSnapshot();
  });
  test("json3", () => {
    const s = readFixture("test/fixtures/youtube_json3.json");
    const o = json3(s);
    // console.log(o.events[2]);
    expect(o.wireMagic).toBe("pb3");
  });
});
