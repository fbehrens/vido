import { readFixture } from "$lib/server/utils";
import { describe, test, expect } from "vitest";
import * as S from "effect/Schema";
import { YoutubeInfoJson } from "./youtube_info";
import { movies } from "$lib/server/db/schema/vido";
import { db } from "$lib/server/db";
import { isNotNull } from "drizzle-orm";

describe("YoutubeInfo", async () => {
  test("fixture", () => {
    const json = readFixture("test/fixtures/youtube_info.json");
    const yi = S.decodeUnknownSync(YoutubeInfoJson)(json);
    expect(yi).toMatchSnapshot();
  });
  for (const { id, data } of await db
    .select({ id: movies.id, data: movies.data })
    .from(movies)
    .where(isNotNull(movies.youtubeId))) {
    test(`YoutubeInfo(${id})`, async () => {
      const yi = S.decodeUnknownSync(YoutubeInfoJson)(data);
    });
  }
});
