import { Command } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect } from "effect";

const command = Command.make("ls", "-al");

// The program depends on a CommandExecutor
const program = Effect.gen(function* () {
  // Runs the command returning the output as a string
  const output = yield* Command.string(command);
  console.log(output);
});

// Provide the necessary CommandExecutor
BunRuntime.runMain(program.pipe(Effect.provide(BunContext.layer)));
