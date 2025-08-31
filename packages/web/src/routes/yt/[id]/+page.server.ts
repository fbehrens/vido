import { db } from "$lib/server/db/index.js";
import { eq } from "drizzle-orm";
import { movies } from "$lib/server/db/schema/vido.js";

export async function load({ params }) {
  const id = Number(params.id);
  const movie = await db.query.movies.findFirst({
    columns: {
      id: true,
      youtubeId: true,
      title: true,
      data: true,
    },
    where: eq(movies.id, id),
    with: {
      captions: {
        columns: {
          data: true,
          typ: true,
        },
      },
    },
  });
  if (movie == undefined) {
    return {
      status: 404,
      body: {
        error: "not found",
      },
    };
  }
  return {
    movie,
  };
}
