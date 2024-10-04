import { describe, test, expect } from "vitest";
import {
  firstNUrl as firstNUrl,
  updateFilmliste,
  firstNFile,
  parseFilme,
  parseDate,
  insertFilme,
  countFilms,
} from "./mediathek";
import { nTimes } from "./util/util";
import { db } from "./db";

describe("mediathek", async () => {
  const d = "07.09.2024, 09:35";
  test("date", () => {
    const date = parseDate(d);
    console.log({ d, date });
  });
  test("profileParse", () => {
    nTimes(2_000_000, parseDate, d);
  });
  test("insertFilme", async () => {
    db.prepare("delete from mediathek").run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name = ?").run("mediathek");
    const i = await insertFilme(parseFilme("static/test/filme181.json"), 100);
    expect(i).toMatchInlineSnapshot(`
{
  "count": 181,
  "counter": Map {
    "3Sat" => Map {
      "37 Grad" => 21,
      "37 Grad Leben" => 6,
      "3sat" => 154,
    },
  },
  "id": 1,
}`);
  });

  test("countFilms", () => {
    const c = countFilms();
    c.count("zdf", "lanz");
    c.count("zdf", "lanz");
    c.count("zdf", "anstalt");
    expect(c.c).toMatchInlineSnapshot(`
Map {
  "zdf" => Map {
    "lanz" => 2,
    "anstalt" => 1,
  },
}`);
  });
});
