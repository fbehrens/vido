import { describe, test, expect } from "vitest";
import {
  firstNUrl as firstNUrl,
  updateFilmliste,
  firstNFile,
  parseFilme,
} from "./mediathek";
describe("mediathek", () => {
  test("fresh filmliste is downloaded", async () => {
    expect(await updateFilmliste()).toBe(false);
    const n = 20;
    const url = await firstNUrl(n);
    expect(url.length).toBe(2 * n);
    const file = await firstNFile(n);
    expect(url).toBe(file);
  }, 60000);

  test("parseFilmetest", async () => {
    const filme = await parseFilme("static/test/filme.json");
    expect(filme.length).toBe(2);
  });
  test("parseFilme", async () => {
    const filme = await parseFilme();
    expect(filme.length).toBeGreaterThan(700000);
  });
});
