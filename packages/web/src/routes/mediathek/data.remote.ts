import { query } from "$app/server";
import { duck } from "$lib/server/db/duck";
import { db_mediathek } from "$lib/server/db/mediathek";
import { films } from "$lib/server/db/schema/mediathek";
import { desc, sql } from "drizzle-orm";
import * as S from "effect/Schema";

const GetFilmsParam = S.Struct({ search: S.String, limit: S.Number });
type GetFilmsParam = S.Schema.Type<typeof GetFilmsParam>;

const where_clause = (s: string) => `where sender || thema || titel || beschreibung like '%${s}%' `;

type FilmDuck = {
  sender: string;
  thema: string;
  titel: string;
  beschreibung: string;
  datum: string;
};
export const getFilmsDuck = query(S.standardSchemaV1(GetFilmsParam), async (param) => {
  const reader = await duck.runAndReadAll(`
    from duck.main.filme
    select
      sender,
      thema,
      titel,
      beschreibung,
      datum,
    ${where_clause(param.search)}
    order by datum desc
    limit ${param.limit};`);
  const data = reader.getRowObjectsJS() as FilmDuck[];
  const count =
    data.length == param.limit
      ? (
          await duck.runAndReadAll(
            `from duck.main.filme select count(*) ${where_clause(param.search)}`,
          )
        ).getRows()[0]
      : data.length;
  return { data, count };
});
