import { describe, test, expect } from "vitest";
import { dbOld } from "./db";
import type { Movie } from "./types";
import { mp3Path } from "./util/util";
import { extractMp3 } from "./ffmpeg";
describe("all segments", async () => {
  const movie = dbOld
    .prepare("SELECT * FROM movies where id =?")
    .get(381) as Movie;
  test.skip("it is found", () => {
    expect(movie.id).toBe(381);
  });
  test.skip("extractMp3", async () => {
    let start = 0;
    const [maxClipLength, overlap] = [1450, 40];
    const end = start + maxClipLength + overlap;
    const mp3file = "static/" + mp3Path(movie.filename, 11);
    await extractMp3(`static/${movie.filename}`, start, end, mp3file);
  });
});
