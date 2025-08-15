import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Effect, Console, Layer } from "effect";
import { FileSystem } from "@effect/platform";

const main = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  yield* Console.log("Hi");
});

main.pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);
