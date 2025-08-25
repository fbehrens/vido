import { describe, it, expect } from "vitest";
import { getFileDir } from "./server/utils";
import { formatSize, unexpectedChars } from "./helper";

const filename = "static/mov/test.mov";
describe("helper", () => {
  it("fileDir", () => {
    expect(getFileDir(filename)).toBe("static/mov/test");
  });
  it("unexpectedChars", () => {
    expect(unexpectedChars({ text: "aebc" }).size).toBe(0);
    expect(unexpectedChars({ text: "aebcc", allowedChars: /[ab]/ })).toStrictEqual(
      new Set(["e", "c"]),
    );
  });

  describe("formatSize", () => {
    it("formats 0 bytes", () => {
      expect(formatSize(0)).toBe("0 B");
    });

    it("formats bytes less than 1 KB", () => {
      expect(formatSize(512)).toBe("512 B");
    });

    it("formats around 1 KB", () => {
      expect(formatSize(1024)).toBe("1 KB");
    });

    it("formats MB correctly", () => {
      expect(formatSize(1048576)).toBe("1 MB");
    });

    it("formats GB correctly", () => {
      expect(formatSize(1073741824)).toBe("1 GB");
    });

    it("formats TB correctly", () => {
      expect(formatSize(1099511627776)).toBe("1 TB");
    });

    it("rounds to 2 decimals", () => {
      expect(formatSize(123456789)).toBe("117.74 MB");
    });
  });
});
