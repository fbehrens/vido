import { describe, test, expect } from "vitest";
import * as fs from "fs";
import { parseDate, parseJson } from "./mediathek";

describe("mediathek", async () => {
  test("parseDate", () => {
    expect(parseDate("07.09.2024, 09:35")).toStrictEqual("2024-09-07 09:35");
  });
  test("parse", () => {
    const buffer = fs.readFileSync("test/filmliste.txt");
    const { info, lines } = parseJson(buffer);
    expect(info).toMatchInlineSnapshot(`
      {
        "hash": "f1907ae164ee8413c302dcf07f08627a",
        "local": "27.09.2025, 21:25",
        "nr": "3",
        "utc": "27.09.2025, 19:25",
        "version": "MSearch [Vers.: 3.1.267]",
      }
    `);
    expect(lines.length).toBe(4);
  });
});
