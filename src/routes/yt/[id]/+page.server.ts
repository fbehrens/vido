import { dbOld } from "$lib/db";
import { db } from "$lib/server/db/index.js";
import { eq } from "drizzle-orm";
import { movies, youtube } from "$lib/server/db/schema.js";
import { json3 as json3Schema, ytInfo } from "$lib/yt.js";

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
          id: true,
          data: true,
          typ: true,
        },
      },
    },
  });
  if (!movie) {
    return {
      status: 404,
      body: {
        error: "not found",
      },
    };
  }
  const yt = ytInfo(movie.data!);
  const caption = movie.captions[0];
  const json3 = caption ? json3Schema(caption.data!) : null;
  return {
    id: movie.id,
    title: movie.title,
    youtubeId: movie.youtubeId,
    chapters: yt.chapters,
    json3,
  };
}
