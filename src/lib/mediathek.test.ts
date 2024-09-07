import { describe, test, expect } from "vitest";
import {
  firstNUrl as firstNUrl,
  updateFilmliste,
  firstNFile,
  parseFilme,
} from "./mediathek";
describe("mediathek", () => {
  test.skip("fresh filmliste is downloaded", async () => {
    expect(await updateFilmliste()).toBe(false);
    for (const n of [20, 30]) {
      const url = await firstNUrl(n);
      const file = await firstNFile(n);
      expect(url.length).toBe(n);
      expect(file.length).toBe(n);
      expect(url).toStrictEqual(file);
      expect(Buffer.compare(url, file)).toBe(0);
    }
  }, 30000);
  test("parseFilme", async () => {
    const filme = await parseFilme();
    console.log(filme);
  });
});
