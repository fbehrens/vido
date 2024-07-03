import { describe, it, expect } from "vitest";
import { artefactLoad, fileDir } from "$lib/util";
import type { Segment } from "$lib/types";
const filename = "static/mov/test.mov";
describe("Util", () => {
  it("fileDir", () => {
    expect(fileDir(filename)).toBe("static/mov/test");
  });
  it("segments", () => {
    const segs = artefactLoad<Segment>(filename, "segments");
    expect(segs.length).toBe(2);
  });
});
