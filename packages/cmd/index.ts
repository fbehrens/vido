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
  //   console.log("Transcript fetched:", transcript);
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
  console.log("Generated text:", chatCompletion("hi"));
}
