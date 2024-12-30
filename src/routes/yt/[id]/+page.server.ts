import { dbOld } from "$lib/db";
import { db } from "$lib/server/db/index.js";
import { eq } from "drizzle-orm";
import { movies, youtube } from "$lib/server/db/schema.js";
import { json3 as json3Schema, YtInfo } from "$lib/yt.js";

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
  console.log(movie.captions[0].typ);
  const ytInfo = new YtInfo(movie.data!).json;
  const json3 = json3Schema(movie.captions[0].data!);
  return {
    id: movie.id,
    title: movie.title,
    youtubeId: movie.youtubeId,
    chapters: ytInfo.chapters,
    json3,
  };
}
