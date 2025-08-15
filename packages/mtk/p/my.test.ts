import { Effect } from "effect";
import { describe, it, assert } from "@effect/vitest";

const effectToTest = Effect.succeed("Hi");

describe("My Effect tests", () => {
  // Always use `it.scoped` to run Effect tests
  it.scoped("should run an Effect and assert the result", () =>
    Effect.gen(function* () {
      const result = yield* effectToTest;
      assert.strictEqual(result, "Hi");
    })
  );
});
