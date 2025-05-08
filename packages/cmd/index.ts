import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function generateOpenai(prompt: string) {
  return await generateText({
    model: openai("o3-mini"),
    prompt,
  });
}

export function add(a: number, b: number) {
  return a + b;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Generated text:", generateOpenai("hi"));
}
