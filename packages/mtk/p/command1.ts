import { Command } from "@effect/platform";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Effect } from "effect";

const command = Command.make("ls", "-al");

// The program depends on a CommandExecutor
const program = Effect.gen(function* () {
  // Runs the command returning the output as a string
  const output = yield* Command.string(command);
  console.log(output);
});

const runable = program.pipe(Effect.provide(NodeContext.layer));
// Provide the necessary CommandExecutor
NodeRuntime.runMain(runable);
