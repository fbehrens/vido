import { assert } from "@std/assert";
import { chatCompletion, summariseYoutube } from "../src/index.ts";

Deno.test("generateOpenaiTest", async () => {
  const r = await chatCompletion("hi");
  assert(typeof r.text === "string");
});

Deno.test("summariseYoutube", async () => {
  const videoId = "dQw4w9WgXcQ";
  const r = await summariseYoutube(videoId);
  console.log({ r });
  assert(typeof r === "string");
});
