import { command, query } from "$app/server";
import { db_mediathek } from "$lib/server/db/mediathek";
import { films } from "$lib/server/db/schema/mediathek";
import { sql } from "drizzle-orm";
import * as S from "effect/Schema";

const GetFmmsParam = S.Struct({ search: S.String, limit: S.Number });
type GetFmmsParam = S.Schema.Type<typeof GetFmmsParam>;

const flms = async (param: GetFmmsParam) => {
  console.log({ param });
  return await db_mediathek
    .select({
      id: films.id,
      sender: films.sender,
      thema: films.thema,
      titel: films.titel,
      datum: films.datum,
      //   url: films.url,
    })
    .from(films)
    .where(sql`${films.thema} like ${"%" + param.search + "%"} `)
    .limit(param.limit);
};

export type Flm = Awaited<ReturnType<typeof flms>>[number];

export const getFlms = query(S.standardSchemaV1(GetFmmsParam), async (p) => await flms(p));
