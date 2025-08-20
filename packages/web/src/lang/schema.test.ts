import { it, expect } from "@effect/vitest";
import { Schema, Effect } from "effect";

it.effect("effectful", () => Effect.sync(() => expect(1).toBe(1)));

const source = Schema.Literal("on", "off");
const target = Schema.Boolean;
// <bool,on|off,never
const BooleanFromString = Schema.transform(
  source,
  target, // Target schema: boolean
  {
    strict: true,
    decode: (literal) => literal === "on", // Always succeeds here
    encode: (bool) => (bool ? "on" : "off"),
  },
);
type Type = typeof BooleanFromString.Type;
type Encoded = typeof BooleanFromString.Encoded;

it("transform", () => expect(Schema.decodeUnknownSync(BooleanFromString)("on")).toBe(true));

it.effect("effect", () => Effect.sync(() => expect(1).toEqual(1)));

const Video = Schema.Struct({
  title: Schema.String,
});
const VideoData = Schema.parseJson(Video);

const encoded = `{"title":"Test Video"}`;
const decoded = { title: "Test Video" };
const decoded_ = { title_: "Test Video" };

it("VideoData", () => {
  expect(Schema.encodeUnknownSync(VideoData)(decoded)).toEqual(encoded);
  expect(Schema.decodeSync(VideoData)(encoded)).toStrictEqual(decoded);
});

const Video_ = Schema.Struct({
  title_: Schema.String,
});

const VideoData_ = Schema.transform(VideoData, Video_, {
  strict: true,
  decode: (data) => ({ title_: data.title }),
  encode: (video) => ({ title: video.title_ }),
});

it("VideoData_", () => expect(Schema.decodeSync(VideoData_)(encoded)).toStrictEqual(decoded_));
