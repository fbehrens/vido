import { describe, it, expect } from "vitest";
import { getFileDir } from "$lib/util";
const filename = "static/mov/test.mov";
describe("Util", () => {
  it("fileDir", () => {
    expect(getFileDir(filename)).toBe("static/mov/test");
  });
});
