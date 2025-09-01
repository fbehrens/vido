import { readFixture } from "$lib/server/utils";
import { describe, test, expect } from "vitest";
import * as S from "effect/Schema";
import { WhisperJson, WhisperSegmented } from "./whisper";

const j = readFixture("test/fixtures/whisper.json");

describe("whisper", () => {
  test("decode", () => {
    expect(S.decodeSync(WhisperJson)(j)).toMatchSnapshot();
  });
  test("transform", () => {
    expect(S.decodeSync(WhisperSegmented)(j)).toMatchSnapshot();
  });
});
