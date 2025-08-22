import { readFixture } from "$lib/server/utils";
import { describe, test, expect } from "vitest";
import * as S from "effect/Schema";
import { Json3Json } from "./json3";

const json = readFixture("test/fixtures/json3.json");

describe("Json3", () => {
  test("parse", () => {
    const j = S.decodeUnknownSync(Json3Json)(json);
    expect(j).toMatchSnapshot();
  });
});
