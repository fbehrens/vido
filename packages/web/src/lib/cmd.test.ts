import { describe, test, expect } from "vitest";
import { add } from "cmd/src/index";
describe("cmd ", () => {
  test("add", () => {
    expect(add(1, 2)).toBe(3);
  });
});
