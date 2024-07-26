import { describe, test, expect } from "vitest";
import { db } from "./db";
describe("all segments", () => {
  const texts = db.prepare("SELECT text FROM segments").all() as {
    text: string;
  }[];
  test("starts with space", () => {
    texts.forEach(({ text }) => expect(/^ /.test(text)).toBe(true));
  });
  test("ends with non-whitespace", () => {
    texts.forEach(({ text }) => expect(/\S$/.test(text)).toBe(true));
  });
});
