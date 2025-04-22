import { dbOld } from "$lib/db";
import { db } from "$lib/server/db";
import type { Movie } from "$lib/types.js";
import { eq } from "drizzle-orm";
import { movies } from "$lib/server/db/schema";

export async function load({ params }) {
  console.log({ serverload: params });
  const { id } = params;

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

  return { movie };
}
