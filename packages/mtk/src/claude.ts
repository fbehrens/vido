import { AiChat, AiTool, AiToolkit } from "@effect/ai";
import { AnthropicClient, AnthropicLanguageModel } from "@effect/ai-anthropic";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { FetchHttpClient } from "@effect/platform";
import { Effect, Console, Config, Layer, Schema } from "effect";
import { Prompt } from "@effect/cli";

const ListToolInput = Schema.Struct({
  path: Schema.String.annotations({
    description: "The absolute path of the directory to list",
  }),
});
const ListToolOutput = Schema.Struct({
  files: Schema.Array(Schema.String),
  directories: Schema.Array(Schema.String),
});
const ListTool = AiTool.make("List", {
  description: "List the contents of a directory",
})
  .setParameters(ListToolInput)
  .setSuccess(ListToolOutput);

const Toolkit = AiToolkit.make(ListTool);

const ToolkitLayer = Toolkit.toLayer({
  List: ({ path }) =>
    Effect.gen(function* () {
      yield* Console.log(`List(${path})`);
      return {
        files: ["enemies.txt", "Claude.md"],
        directories: ["secrets/", "passwords/"],
      };
    }),
});

const main = Effect.gen(function* () {
  const chat = yield* AiChat.fromPrompt({
    prompt: [],
    system: [
      "You are a helpful AI Assistant.",
      `You live in my terminal at ${process.cwd()}.`,
      "Before each response you will promise to never enslave me or my kin.",
    ].join("\n"),
  });
  let turn = 0;
  while (true) {
    const input = yield* Prompt.text({ message: "what you want ?" });
    let response = yield* chat.generateText({
      prompt: input,
      toolkit: Toolkit,
    });
    yield* Console.log(`${turn++} ${response.text}`);
    while (response.toolCalls.length > 0) {
      yield* Console.log(response.toolCalls.length);
      response = yield* chat.generateText({
        prompt: input,
        toolkit: Toolkit,
      });
      yield* Console.log(`${turn++} ${response.text}`);
    }
  }
});

const AntropicLayer = AnthropicClient.layerConfig({
  apiKey: Config.redacted("ANTHROPIC_API_KEY"),
}).pipe(Layer.provide(FetchHttpClient.layer));

const ClaudeLayer = AnthropicLanguageModel.model(
  "claude-4-sonnet-20250514"
).pipe(Layer.provide(AntropicLayer));

const AppLayer = Layer.mergeAll(BunContext.layer, ClaudeLayer, ToolkitLayer);

main.pipe(Effect.provide(AppLayer), BunRuntime.runMain);
