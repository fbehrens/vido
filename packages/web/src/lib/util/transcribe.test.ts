import { readFixture } from "$lib/server/utils";
import { unexpectedChars } from "$lib/utils";
import { whisperApiSchema } from "$lib/zod-schema";
import { describe, test, expect } from "vitest";
import { waToString } from "./transcribe";
import { calcSegments } from "$lib/utils";
describe("transcribe", () => {
  test("segmenting", async () => {
    const j = readFixture("test/fixtures/whisperApi.json");
    const wa = whisperApiSchema.parse(JSON.parse(j));

    expect(waToString(wa)).toMatchInlineSnapshot(`
      [
        "Next movement, opening. Rotate your arms. Palms turn facing yourself. Lift up your arms. Leads by your body. Upper arms, forearms to palms. Keep between arms shoulder-width apart. Until your arms shoulder-level, go down, push. Start from body. Upper arms, forearms to palms. And gradually setting your palms. Push to where? We say almost to the bottom. Keep between arms, still shoulder-width apart. This is opening.",
        " Next movement, opening. Rotate your arms. Palms turn facing yourself. Lift up your arms.| Leads by your body. Upper arms, forearms to palms. Keep between arms shoulder-width apart.| Until your arms shoulder-level, go down, push. Start from body. Upper arms, forearms to palms.| And gradually setting your palms. Push to where? We say almost to the bottom.| Keep between arms, still shoulder-width apart. This is opening.",
        "Next|movement|opening|Rotate|your|arms|Palms|turn|facing|yourself|Lift|up|your|arms|Leads|by|your|body|Upper|arms|forearms|to|palms|Keep|between|arms|shoulder|width|apart|Until|your|arms|shoulder|level|go|down|push|Start|from|body|Upper|arms|forearms|to|palms|And|gradually|setting|your|palms|Push|to|where|We|say|almost|to|the|bottom|Keep|between|arms|still|shoulder|width|apart|This|is|opening",
      ]
    `);
    expect(unexpectedChars({ text: wa.text }).size).toBe(0);

    const result = calcSegments(wa);
    await expect(result).toMatchFileSnapshot("whisperApi.segments");
  });
});
