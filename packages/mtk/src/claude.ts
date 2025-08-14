import { Effect } from "effect";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Prompt } from "@effect/cli";

const main = Effect.gen(function* () {
  while (true) {
    const input = yield* Prompt.text({ message: "what you want ?" });
  }
});

main.pipe(Effect.provide(BunContext.layer), BunRuntime.runMain);
