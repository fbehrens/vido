import { command, query } from "$app/server";
import { db_mediathek } from "$lib/server/db/mediathek";
import { films } from "$lib/server/db/schema/mediathek";

const flms = async () =>
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
    .limit(3);

export type Flm = Awaited<ReturnType<typeof flms>>[number];

export const getFlms = query(async () => await flms());
