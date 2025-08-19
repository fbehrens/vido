import { db } from "$lib/server/db";
import { eq, and, isNotNull } from "drizzle-orm";
import { captions, movies } from "$lib/server/db/schema/vido";
import { Schema } from "effect";
import { command, query } from "$app/server";
import tmp from "tmp";
import { extractMp3 } from "$lib/ffmpeg";
import { transcribe } from "$lib/whisper";

export const getMovie = query(Schema.standardSchemaV1(Schema.Number), async (id) => {
  console.log({ a: "getMovie", id });
  const movie = await db.query.movies.findFirst({
    columns: {
      id: true,
      filename: true,
      duration: true,
    },
    where: eq(movies.id, id),
    with: {
      captions: {
        columns: {
          typ: true,
          data: true,
        },
      },
    },
  });
  if (movie == undefined) {
    throw new Error("Movie not found");
  }
  console.log({ a: "server", movie });
  return movie;
});

export const getOpenai = command(Schema.standardSchemaV1(Schema.Number), async (id) => {
  const [{ filename, duration }] = await db
    .select({
      filename: movies.filename,
      duration: movies.duration,
    })
    .from(movies)
    .where(and(eq(movies.id, id), isNotNull(movies.filename)));

  const mp3_filename = tmp.fileSync().name + ".mp3";
  await extractMp3(`static/${filename}`, 0, duration, mp3_filename);
  const transcript = await transcribe(mp3_filename);
  await db.insert(captions).values({
    movieId: id,
    typ: "WhisperApi",
    data: JSON.stringify(transcript),
    details: JSON.stringify({ mp3_filename }),
  });

  const result = `${filename} -> ${mp3_filename}`;
  console.log({ result });
  return result;
});
