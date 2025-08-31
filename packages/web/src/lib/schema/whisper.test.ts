import { readFixture } from "$lib/server/utils";
import { describe, test, expect } from "vitest";
import * as S from "effect/Schema";
import { WhisperJson } from "./whisper";

const j = readFixture("test/fixtures/whisper.json");
const wa = S.decodeSync(WhisperJson)(j);

describe("whisper", () => {
  test("", () => {
    expect(wa).toMatchSnapshot();
  });
});
