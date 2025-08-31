import * as S from "effect/Schema";
import { ParseResult } from "effect";

export const YouTubeVideoId = S.String.pipe(
  S.transformOrFail(
    S.String.pipe(
      S.pattern(/^[a-zA-Z0-9_-]{11}$/), // YouTube video IDs are 11 characters long
      S.annotations({
        title: "YouTube Video ID",
        description: "A valid YouTube video ID (11 characters)",
      }),
    ),
    {
      strict: true,
      decode: (url: string, _, ast) => {
        if (url.length === 11) return ParseResult.succeed(url);
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        if (hostname === "youtu.be") {
          return ParseResult.succeed(urlObj.pathname.slice(1));
        }
        if (hostname === "www.youtube.com" || hostname === "youtube.com") {
          if (urlObj.searchParams.has("v")) {
            return ParseResult.succeed(urlObj.searchParams.get("v")!);
          }
          if (urlObj.pathname.startsWith("/embed/")) {
            return ParseResult.succeed(urlObj.pathname.slice(7));
          }
        }
        return ParseResult.fail(
          new ParseResult.Type(
            ast, // Provide the schema's abstract syntax tree for context
            url, // Include the problematic input
            "Failed to extract YoutubeUrl", // Optional custom error message
          ),
        );
      },
      encode: (id: string) => ParseResult.succeed(id), // The ID can be used as-is
    },
  ),
  S.annotations({
    title: "YouTube URL to Video ID",
    description: "Transforms YouTube URLs or video IDs into standardized video IDs",
  }),
);
