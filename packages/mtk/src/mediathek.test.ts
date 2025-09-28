import { describe, test, expect } from "vitest";
import * as fs from "fs";
import { columns, parseDate, parseJson2 } from "./mediathek";

describe("mediathek", async () => {
  test("parseDate", () => {
    expect(parseDate("07.09.2024, 09:35")).toStrictEqual(
      new Date("2024-09-07T07:35:00.000Z")
    );
  });
  test("parse", () => {
    const text = fs.readFileSync("test/filmliste.txt", "utf-8");
    const {
      Filmliste: [info, actualColumns],
      X,
    } = parseJson2(text);
    expect(info).toMatchInlineSnapshot(`
      [
        "27.09.2025, 21:25",
        "27.09.2025, 19:25",
        "3",
        "MSearch [Vers.: 3.1.267]",
        "f1907ae164ee8413c302dcf07f08627a",
      ]
    `);
    expect(actualColumns).toStrictEqual(columns);
    expect(X.length).toBe(4);
    for (const row of X) {
      expect(row.length).toBe(20);
    }
    expect(X[1]![0]).toBe("ard");
  });
});
