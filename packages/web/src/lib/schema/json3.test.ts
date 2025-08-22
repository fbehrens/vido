import { readFixture } from "$lib/server/utils";
import { describe, test, expect } from "vitest";
import * as S from "effect/Schema";
import { Json3Json } from "./json3";
import { captions } from "$lib/server/db/schema/vido";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";

const json = readFixture("test/fixtures/json3.json");

describe("Json3", async () => {
  test("parse", () => {
    const j = S.decodeUnknownSync(Json3Json)(json);
    expect(j).toMatchSnapshot();
  });

  for (const { id, data } of await db
    .select({ id: captions.id, data: captions.data })
    .from(captions)
    .where(eq(captions.typ, "json3"))) {
    test(`YoutubeInfo(${id})`, () => {
      const _ = S.decodeUnknownSync(Json3Json)(data);
    });
  }
});
