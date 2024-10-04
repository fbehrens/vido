import { describe, test, expect, beforeEach } from "vitest";
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

  describe("insert", async () => {
    beforeEach(() => {
      db.prepare("delete from mediathek").run();
      db.prepare("DELETE FROM sqlite_sequence WHERE name = ?").run("mediathek");
    });
    test("insertFilme", async () => {
      const i = await insertFilme(parseFilme("static/test/filme181.json"), 100);
      expect(i).toMatchObject({ count: 181, id: 1 });
      expect(i.counter.toString()).toBe(`3Sat
  37 Grad: 21
  37 Grad Leben: 6
  3sat: 154\n`);
    });

    test("filter", async () => {
      const i = await insertFilme(
        parseFilme("static/test/filme181.json", (f) => f[1] == "3sat"),
        1000,
      );
      expect(i.count).toBe(154);
    });
  });

  test("countFilms", () => {
    const c = countFilms();
    c.count("zdf", "lanz");
    c.count("zdf", "lanz");
    c.count("zdf", "anstalt");
    expect(c.toString()).toBe(`zdf
  lanz: 2
  anstalt: 1\n`);
  });
});
