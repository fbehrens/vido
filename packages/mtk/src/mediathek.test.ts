import { describe, test, expect, beforeEach, it } from "vitest";
import { parseDate, updateFilmliste } from "./mediathek";

describe("mediathek", async () => {
  const d = "07.09.2024, 09:35";
  test("date", () => {
    const date = parseDate(d);
    expect(date).toStrictEqual(new Date("2024-09-07T07:35:00.000Z"));
  });
});
