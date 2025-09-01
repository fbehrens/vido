import { Segments } from "./Segments";
import { WhisperSegmented } from "./whisper";
import { WhisperApiSegmented } from "./whisper_api";
import * as S from "effect/Schema";

const TypJson = S.Struct({
  typ: S.Literal("whisper", "whisper_api"),
  data: S.String,
});
export type TypJson = S.Schema.Type<typeof TypJson>;

export const TypSegmented = S.transform(TypJson, Segments, {
  strict: true,
  decode: ({ typ, data }) => {
    if (typ == "whisper") {
      return S.decodeSync(WhisperSegmented)(data);
    } else if (typ == "whisper_api") {
      return S.decodeSync(WhisperApiSegmented)(data);
    }
    throw new Error(`Unknown typ: ${typ}`);
  },
  encode: (segms) => segms as any,
});
