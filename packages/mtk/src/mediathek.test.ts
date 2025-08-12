import { describe, test, expect, beforeEach } from "vitest";
import { parseDate, updateFilmliste } from "./mediathek";
import { nTimes } from "./util";

describe("mediathek", async () => {
  const d = "07.09.2024, 09:35";
  test("date", () => {
    const date = parseDate(d);
    console.log({ d, date });
  });

  test("profileParse", () => {
    nTimes(200_000, parseDate, d);
  });
});
