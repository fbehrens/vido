import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { movies } from "$lib/server/db/schema/vido";
import * as v from "valibot";
import { query } from "$app/server";

export const getMovie = query(v.string(), async (id) => {
  console.log({ a: "getMovie", id });
  const movie = await db.query.movies.findFirst({
    columns: {
      id: true,
      filename: true,
      duration: true,
    },
    where: eq(movies.id, Number(id)),
    with: {
      captions: {
        columns: {
          typ: true,
          data: true,
        },
      },
    },
  });
  console.log({ a: "server", movie });
  return movie;
});
