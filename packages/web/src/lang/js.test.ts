import { describe, test, expect } from "vitest";

function f({ p1, p2 = "v2" }: { p1: string; p2?: string }) {
  return { p1, p2 };
}
describe("functions", () => {
  test("default parameters", () => {
    expect(f({ p1: "v1" })).toStrictEqual({ p1: "v1", p2: "v2" });
    expect(f({ p1: "v1", p2: "v" })).toStrictEqual({ p1: "v1", p2: "v" });
  });
});
describe("RegEx", () => {
  test("Character Class", () => {
    // whitespace
    expect(/\s/.test(" ")).toBeTruthy();
    expect(/\S/.test("a")).toBeTruthy();
    // word
    expect(/\w/.test("a")).toBeTruthy();
    expect(/\W/.test("-")).toBeTruthy();
    // digit
    expect(/\d/.test("1")).toBeTruthy();
  });
  test("string", () => {
    expect(new RegExp("a" + "b", "g")).toStrictEqual(/ab/g);
    expect(new RegExp("\\.")).toStrictEqual(/\./);

    const r = /a/g;
    expect(`${r}`).toBe("/a/g");
    expect(r.source).toBe("a");
  });
});
describe("string", () => {
  test("basic", () => {
    expect("l".length).toBe(1);
    expect("123"[2]).toBe("3");
    expect("1234".substring(2)).toBe("34");
  });
});
