import { describe, test, expect } from "vitest";
import {
  firstNUrl as firstNUrl,
  updateFilmliste,
  firstNFile,
  parseFilme,
  parseDate,
  insertFilme,
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
  test.skip("updateFilmliste", async () => {
    await updateFilmliste();
    expect(await updateFilmliste()).toBe(false);
    const n = 20;
    const url = await firstNUrl(n);
    expect(url.length).toBe(2 * n);
    const file = await firstNFile(n);
    expect(url).toBe(file);
  }, 30000);

  test("insertFilme", async () => {
    db.prepare("delete from mediathek").run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name = ?").run("mediathek");
    const i = await insertFilme(parseFilme("static/test/filme181.json"), 100);
    expect(i).toStrictEqual({ id: 1, count: 181 });
  });
});
