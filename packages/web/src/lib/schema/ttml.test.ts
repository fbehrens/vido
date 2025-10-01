import { readFixture } from "$lib/server/utils";
import { describe, test, expect } from "vitest";
import { ttmlToSegments } from "./ttml";

const xml = readFixture("test/fixtures/ttml.xml");

describe("ttml", async () => {
  test("parse", async () => {
    const ttml = await ttmlToSegments(xml);
    expect(ttml).toMatchSnapshot();
  });
});
