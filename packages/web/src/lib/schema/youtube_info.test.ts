import { readFixture } from "$lib/server/utils";
import { describe, test, expect } from "vitest";
import * as S from "effect/Schema";
import { YoutubeInfoJson } from "./youtube_info";

const json = readFixture("test/fixtures/youtube_info.json");

describe("YoutubeInfo", () => {
  test("parse", () => {
    const yi = S.decodeUnknownSync(YoutubeInfoJson)(json);
    expect(yi).toMatchSnapshot();
  });
});
