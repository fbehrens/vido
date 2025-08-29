import { query } from "$app/server";
import { db_mediathek } from "$lib/server/db/mediathek";
import { films } from "$lib/server/db/schema/mediathek";
import { sql } from "drizzle-orm";
import * as S from "effect/Schema";

const GetFilmsParam = S.Struct({ search: S.String, limit: S.Number });
type GetFilmsParam = S.Schema.Type<typeof GetFilmsParam>;

const where_clause = (s: string) =>
  sql`${films.sender} || ${films.thema} || ${films.titel} || ${films.beschreibung} like ${"%" + s + "%"} `;

export const getFilms = query(S.standardSchemaV1(GetFilmsParam), async (param) => {
  const data = await db_mediathek
    .select({
      id: films.id,
      sender: films.sender,
      thema: films.thema,
      titel: films.titel,
      beschreibung: films.beschreibung,
      datum: films.datum,
    })
    .from(films)
    .where(where_clause(param.search))
    .limit(param.limit);
  const count =
    data.length == param.limit
      ? await db_mediathek.$count(films, where_clause(param.search))
      : data.length;
  return { data, count };
});
export type Film = Awaited<ReturnType<typeof getFilms>>["data"][number];
