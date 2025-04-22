import { describe, it, expect } from "vitest";
import { getFileDir, nTimes } from "$lib/util/util";
const filename = "static/mov/test.mov";
describe("Util", () => {
  it("fileDir", () => {
    expect(getFileDir(filename)).toBe("static/mov/test");
  });
  it("nTimes", () => {
    function foo(n, m) {
      const r = { n, m };
      console.log(r);
      return r;
    }
    const a = [1, 2];
    expect(foo(...a)).toEqual({ n: 1, m: 2 });

    nTimes(2, foo, 1, 2);
  });
});
