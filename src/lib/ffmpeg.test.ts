import { describe, test, expect } from "vitest";
import { extractMp3, getDuration } from "$lib/ffmpeg";

const filepath = "static/mov/test.mov";

describe("ffmpeg", async () => {
  test("duration", async () => {
    expect(await getDuration(filepath)).toBe(113.92);
  });
  test("extractMp3", async () => {
    await extractMp3(filepath, 0, 12, "play/out/0-12.mp3");
    // await extractMp3(filepath, 12, 12, "play/out/12-24.mp3");
  });
});
