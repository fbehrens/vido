import { describe, test, expect } from "vitest";
import {
  firstNUrl as firstNUrl,
  updateFilmliste,
  firstNFile,
  parseFilme,
} from "./mediathek";

function count(arr, prop) {
  return arr.reduce(
    (acc, e) => {
      acc[e[prop]] = (acc[e[prop]] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );
}

describe("mediathek", () => {
  test.skip("updateFilmliste", async () => {
    await updateFilmliste();
    expect(await updateFilmliste()).toBe(false);
    const n = 20;
    const url = await firstNUrl(n);
    expect(url.length).toBe(2 * n);
    const file = await firstNFile(n);
    expect(url).toBe(file);
  }, 30000);

  test("parseFilme181", async () => {
    const filme = await parseFilme({
      path: "static/test/filme181.json",
      bulkSql: false,
      step: 10,
    });
    console.log(count(filme, "sender"));
  });
  test.skip("parseFilme", async () => {
    const filme = await parseFilme({ bulkSql: false });
    expect(filme!.length).toBeGreaterThan(700000);
  });
});
