import { readFileSync } from "fs";
import { join } from "path";
import { describe, test, expect } from "vitest";
import { json3, YtInfo } from "./yt";

function json(file: string) {
  return readFileSync(join("test", "fixtures", file), "utf-8");
}
describe("yt.ts", () => {
  test("YtInfo", () => {
    const ytInfo = new YtInfo(json("youtube_info.json"));
    // console.log(ytInfo.json);
    expect(ytInfo.json.id).toBe("rg7Fvvl3taU");
  });
  test("json3", () => {
    const s = json("youtube_json3.json");
    const o = json3(s);
    console.log(o.events[2]);
    expect(o.wireMagic).toBe("pb3");
  });
});
