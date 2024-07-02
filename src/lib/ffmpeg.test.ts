import { describe, it, expect } from "vitest";
import { extractMp3, duration } from "$lib/ffmpeg";

const filepath = "static/mov/test.mov";

describe("ffmpeg", async () => {
  it("duration", async () => {
    expect(await duration(filepath)).toBe(113.92);
  });
  it("extractMp3", async () => {
    await extractMp3(filepath, 0, 12, "play/out/0-12.mp3");
    await extractMp3(filepath, 12, 12, "play/out/12-24.mp3");
  });
});
