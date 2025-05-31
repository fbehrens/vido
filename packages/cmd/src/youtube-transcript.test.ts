import { assertEquals } from "jsr:@std/assert";
import { YoutubeTranscript } from "./youtube-transcript.ts";

const videoId = "dQw4w9WgXcQ";
Deno.test("fetchTranscript", async () => {
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  assertEquals(transcript[1], {
    duration: 4.32,
    lang: "de-DE",
    offset: 22.64,
    text: "Du kennst die Regeln genau wie ich",
  });
});

Deno.test("textOnly", async () => {
  const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
    textOnly: true,
  });
  assertEquals(transcript.slice(0, 20), " Uns beiden ist die ");
});
