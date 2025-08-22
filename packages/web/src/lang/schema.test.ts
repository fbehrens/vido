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
const _ = Schema.asSchema(BooleanFromString); // <bool,on|off,never>
type Type = typeof BooleanFromString.Type;
type Encoded = typeof BooleanFromString.Encoded;

it("transform", () => expect(Schema.decodeUnknownSync(BooleanFromString)("on")).toBe(true));

it.effect("effect", () => Effect.sync(() => expect(1).toEqual(1)));

const Video = Schema.Struct({
  title: Schema.String,
});
class VideoC extends Schema.Class<VideoC>("Person")({
  title: Schema.String,
}) {}

const VideoJson = Schema.parseJson(Video);
const VideoDataC = Schema.parseJson(VideoC);

const Video_ = Schema.Struct({
  title_: Schema.String,
});

class VideoC_ extends Schema.Class<VideoC_>("Person")({
  title_: Schema.String,
}) {}

const encoded = `{"title":"Test Video"}`;

const decoded = { title: "Test Video" };
const decodedC = new VideoC({ title: "Test Video" });
const decoded_ = { title_: "Test Video" };
const decodedC_ = new VideoC_({ title_: "Test Video" });

it("VideoData", () => {
  expect(Schema.encodeUnknownSync(VideoJson)(decoded)).toEqual(encoded);
  expect(Schema.encodeUnknownSync(VideoDataC)(decoded)).toEqual(encoded);
  expect(Schema.decodeSync(VideoJson)(encoded)).toStrictEqual(decoded);
});

const VideoData_ = Schema.transform(VideoJson, Video_, {
  strict: true,
  decode: (data) => ({ title_: data.title }),
  encode: (video) => ({ title: video.title_ }),
});

const VideoDataC_ = Schema.transform(VideoDataC, VideoC_, {
  strict: true,
  decode: (v) => new VideoC_({ title_: v.title }),
  encode: (v_) => new VideoC({ title: v_.title_ }),
});

it("VideoData_", () => expect(Schema.decodeSync(VideoData_)(encoded)).toStrictEqual(decoded_));
it("VideoDataC_", () => expect(Schema.decodeSync(VideoDataC_)(encoded)).toStrictEqual(decodedC_));

const schema = Schema.URL;
it("url", () =>
  expect(Schema.decodeUnknownSync(schema)("https://example.com")).toStrictEqual(
    new URL("https://example.com"),
  ));
