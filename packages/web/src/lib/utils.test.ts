import { describe, it, expect } from "vitest";
import { getFileDir } from "$lib/utils";
import { unexpectedChars } from "./util/transcribe";
const filename = "static/mov/test.mov";
describe("Util", () => {
  it("fileDir", () => {
    expect(getFileDir(filename)).toBe("static/mov/test");
  });
  it("unexpectedChars", () => {
    expect(unexpectedChars({ text: "aebc" }).size).toBe(0);
    expect(unexpectedChars({ text: "aebcc", allowedChars: /[ab]/ })).toStrictEqual(
      new Set(["e", "c"]),
    );
  });
});
