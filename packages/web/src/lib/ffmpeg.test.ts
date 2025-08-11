import { describe, test, expect } from "vitest";
import { getDuration } from "$lib/ffmpeg";

const filepath = "static/test/opening.mkv";

describe("ffmpeg", async () => {
  test("duration", async () => {
    expect(await getDuration(filepath)).toBe(44.969);
  });
});
