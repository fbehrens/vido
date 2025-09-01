import { readFixture } from "$lib/server/utils";
import { describe, test, expect } from "vitest";
import * as S from "effect/Schema";
import { WhisperApiJson, WhisperApiSegmented } from "./whisper_api";
import { TypSegmented } from "./captions";

const data = readFixture("test/fixtures/whisperApi.json");

describe("whisper_api", () => {
  test("decode", () => {
    expect(S.decodeSync(WhisperApiJson)(data)).toMatchSnapshot();
  });
  test("transform", () => {
    expect(S.decodeSync(WhisperApiSegmented)(data)).toMatchSnapshot();
  });
  test("TypSegmented", () => {
    expect(S.decodeSync(TypSegmented)({ typ: "whisper_api", data })).toMatchSnapshot();
  });
});
