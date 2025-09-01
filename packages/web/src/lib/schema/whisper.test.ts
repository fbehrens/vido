import { readFixture } from "$lib/server/utils";
import { describe, test, expect } from "vitest";
import * as S from "effect/Schema";
import { WhisperJson, WhisperSegmented } from "./whisper";
import { TypSegmented } from "./captions";

const data = readFixture("test/fixtures/whisper.json");

describe("whisper", () => {
  test("decode", () => {
    expect(S.decodeSync(WhisperJson)(data)).toMatchSnapshot();
  });
  test("transform", () => {
    expect(S.decodeSync(WhisperSegmented)(data)).toMatchSnapshot();
  });
  test("TypSegmented", () => {
    expect(S.decodeSync(TypSegmented)({ typ: "whisper", data })).toMatchSnapshot();
  });
});
