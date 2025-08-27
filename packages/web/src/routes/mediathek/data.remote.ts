import { command, query } from "$app/server";
import { db_mediathek } from "$lib/server/db/mediathek";
import { films } from "$lib/server/db/schema/mediathek";
import { sql } from "drizzle-orm";
import * as S from "effect/Schema";

const GetFmmsParam = S.Struct({ search: S.String, limit: S.Number });
type GetFmmsParam = S.Schema.Type<typeof GetFmmsParam>;

const where_clause = (s: string) => sql`${films.thema} like ${"%" + s + "%"} `;

const flms = async (param: GetFmmsParam) =>
  await db_mediathek
    .select({
      id: films.id,
      sender: films.sender,
      thema: films.thema,
      titel: films.titel,
      datum: films.datum,
      //   url: films.url,
    })
    .from(films)
    .where(where_clause(param.search))
    .limit(param.limit);
export type Flm = Awaited<ReturnType<typeof flms>>[number];

const flms_fromasync = async (param: GetFmmsParam) => {
  const data = await flms(param);
  const count =
    data.length == param.limit
      ? await db_mediathek.$count(films, where_clause(param.search))
      : data.length;
  return { data, count };
};

export const getFlms = query(
  S.standardSchemaV1(GetFmmsParam),
  async (p) => await flms_fromasync(p),
);
