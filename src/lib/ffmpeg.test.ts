import { describe, test, expect } from "vitest";
import { getDuration } from "$lib/ffmpeg";

const filepath = "static/mov/test.mov";

describe("ffmpeg", async () => {
  test("duration", async () => {
    expect(await getDuration(filepath)).toBe(113.92);
  });
});
