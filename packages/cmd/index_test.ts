import { assertEquals, assert } from "@std/assert";
import { add, chatCompletion, summariseYoutube } from "./index.ts";

Deno.test("addTest", () => {
  assertEquals(add(2, 3), 5);
});

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
