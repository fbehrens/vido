import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { YoutubeTranscript } from "youtube-transcript";

const model = openai("o3-mini");
export async function chatCompletion(prompt: string) {
  return await generateText({
    model,
    prompt,
  });
}

export async function summariseYoutube(videoId: string) {
  const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
    textOnly: true,
  });
  console.log({ transcript });
  if (!transcript) return "no transcript available";
  const prompt = `\
Summarise the following transcript from a Youtube video.
Please use markdown as output format.

${transcript}`;
  const completion = await chatCompletion(prompt);
  return completion.text;
}

export function add(a: number, b: number) {
  return a + b;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const [cmd, ...args] = Deno.args;
  if (cmd === "chat") {
    const prompt = args.join(" ");
    if (!prompt) {
      console.error("Usage: deno run index.ts chat <prompt>");
      Deno.exit(1);
    }
    const result = await chatCompletion(prompt);
    console.log(result.text);
  } else if (cmd === "summarise") {
    const [videoId] = args;
    if (!videoId) {
      console.error("Usage: deno run index.ts summarise <youtubeVideoId>");
      Deno.exit(1);
    }
    const summary = await summariseYoutube(videoId);
    console.log(summary);
  } else {
    console.log(
      `Usage:\n  deno run index.ts chat <prompt>\n  deno run index.ts summarise <youtubeVideoId>`
    );
    Deno.exit(1);
  }
}
