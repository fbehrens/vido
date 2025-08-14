import { AiChat } from "@effect/ai";
import { AnthropicClient, AnthropicLanguageModel } from "@effect/ai-anthropic";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { FetchHttpClient } from "@effect/platform";
import { Effect, Console, Config, Layer } from "effect";
import { Prompt } from "@effect/cli";

const main = Effect.gen(function* () {
  const chat = yield* AiChat.fromPrompt({
    prompt: [],
    system: [
      "You are a helpful AI Assistant.",
      `You live in my terminal at ${process.cwd()}.`,
      "Before each response you will promise to never enslave me or my kin.",
    ].join("\n"),
  });
  while (true) {
    // get the user input
    const input = yield* Prompt.text({ message: "what you want ?" });
    // feed the llm
    const response = yield* chat.generateText({ prompt: input });
    // print the llm's response
    yield* Console.log(response.text);
  }
});

const AntropicLayer = AnthropicClient.layerConfig({
  apiKey: Config.redacted("ANTHROPIC_API_KEY"),
}).pipe(Layer.provide(FetchHttpClient.layer));

const ClaudeLayer = AnthropicLanguageModel.model(
  "claude-4-sonnet-20250514"
).pipe(Layer.provide(AntropicLayer));

const AppLayer = Layer.mergeAll(BunContext.layer, ClaudeLayer);

main.pipe(Effect.provide(AppLayer), BunRuntime.runMain);
