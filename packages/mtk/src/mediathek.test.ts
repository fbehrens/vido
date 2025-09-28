import { describe, test, expect } from "vitest";
import { parseDate } from "./mediathek";

describe("mediathek", async () => {
  test("parseDate", () => {
    expect(parseDate("07.09.2024, 09:35")).toStrictEqual(
      new Date("2024-09-07T07:35:00.000Z")
    );
  });
});
