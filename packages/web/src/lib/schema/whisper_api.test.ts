import { readFixture } from "$lib/server/utils";
import { describe, test, expect } from "vitest";
import * as S from "effect/Schema";
import { WhisperApiJson } from "./whisper_api";

const j = readFixture("test/fixtures/whisperApi.json");
const wa = S.decodeSync(WhisperApiJson)(j);

describe("whisper_api", () => {
  test("", () => {
    expect(wa).toMatchSnapshot();
  });
});
