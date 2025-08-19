import { describe, test, expect } from "vitest";
import { Schema } from "effect";

const BooleanFromString = Schema.transform(
  Schema.Literal("on", "off"), // Source schema: "on" or "off"
  Schema.Boolean, // Target schema: boolean
  {
    strict: true,
    decode: (literal) => literal === "on", // Always succeeds here
    encode: (bool) => (bool ? "on" : "off"),
  },
);
type Encoded = typeof BooleanFromString.Encoded;
type Type = typeof BooleanFromString.Type;
describe("schema", () => {
  test("", () => {
    expect(Schema.decodeUnknownSync(BooleanFromString)("on")).toBe(true);
  });
});
