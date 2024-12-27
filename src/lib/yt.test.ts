import { readFileSync } from "fs";
import { join } from "path";
import { describe, test, expect } from "vitest";
import { YtInfo } from "./yt";
describe("yt.ts", () => {
  test("YtInfo", () => {
    const json: string = readFileSync(
      join("test", "fixtures", "youtube_info.json"),
      "utf-8",
    );
    const ytInfo = new YtInfo(json);
    console.log(ytInfo.json);

    expect(json).toBeTruthy();
  });
});
