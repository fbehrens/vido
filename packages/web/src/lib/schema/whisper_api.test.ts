import { readFixture } from "$lib/server/utils";
import { describe, test, expect } from "vitest";
import * as S from "effect/Schema";
import { WhisperApiJson, WhisperApiSegmented } from "./whisper_api";

const j = readFixture("test/fixtures/whisperApi.json");

describe("whisper_api", () => {
  test("decode", () => {
    expect(S.decodeSync(WhisperApiJson)(j)).toMatchSnapshot();
  });
  test("transform", () => {
    expect(S.decodeSync(WhisperApiSegmented)(j)).toMatchSnapshot();
  });
});
