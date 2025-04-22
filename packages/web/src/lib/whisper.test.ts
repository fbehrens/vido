import { describe, it, expect, test } from "vitest";
import { transcribe } from "$lib/whisper";
describe("whisper", () => {
  test.skip("transcribe", async () => {
    const f = "play/out/12-24.mp3";
    const t = await transcribe(f);
    console.log(t);
    expect(1).toBe(1);
  });
});
