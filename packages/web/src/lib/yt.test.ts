import { readFileSync } from "fs";
import { join } from "path";
import { describe, test, expect } from "vitest";
import { show_captions, json3, ytInfo, get_json3_url } from "./yt";

function json(file: string) {
  return readFileSync(join("test", "fixtures", file), "utf-8");
}
describe("yt.ts", () => {
  test("YtInfo", () => {
    const yt = ytInfo(json("youtube_info.json"));
    // console.log(ytInfo.json);
    expect(yt.id).toBe("rg7Fvvl3taU");
    // show_captions(yt);
    const caption = get_json3_url(yt);
    console.log(caption);
  });
  test("json3", () => {
    const s = json("youtube_json3.json");
    const o = json3(s);
    // console.log(o.events[2]);
    expect(o.wireMagic).toBe("pb3");
  });
});
