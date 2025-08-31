import { command, form, query } from "$app/server";
import { db } from "$lib/server/db";
import * as S from "effect/Schema";
import { captions, movies } from "$lib/server/db/schema/vido";
import { ytPlpGetInfo } from "$lib/server/yt_dlp";
import { sqliteDate } from "$lib/server/utils";
import { YouTubeVideoId } from "$lib/yt";
import { isNotNull, desc } from "drizzle-orm";
import { YoutubeInfoJson, get_json3_url } from "$lib/schema/youtube_info";

export const getYoutube = query(async () => {
  const yt = await db
    .select({ id: movies.id, youtubeId: movies.youtubeId, title: movies.title })
    .from(movies)
    .where(isNotNull(movies.youtubeId))
    .orderBy(desc(movies.created_at));
  return yt;
});

export const createYoutube = form(async (data) => {
  const url = data.get("url") as string;
  console.log({ url });

  const youtubeId = S.decodeSync(YouTubeVideoId)(url);
  if (!youtubeId) {
    console.log({ err: `Do not have youtubeId`, url });
    return;
  }
  const info = await ytPlpGetInfo(youtubeId);
  const yt = S.decodeUnknownSync(YoutubeInfoJson)(info);
  const { movie_id: movieId } = await db
    .insert(movies)
    .values({
      youtubeId,
      data: info,
      title: yt.title,
      language: yt.language,
      channel: yt.channel,
      description: yt.description,
      duration: yt.duration,
      created_at: sqliteDate(),
    })
    .returning({ movie_id: movies.id })
    .get();
  console.log(`create movie ${movieId}`);
  const json3Url = get_json3_url(yt);
  if (json3Url === undefined) return;
  const response = await fetch(json3Url);
  if (!response.ok) throw "Error fetching json3";
  const da = await response.text();
  await db.insert(captions).values({
    movieId,
    data: da,
    typ: "json3",
    details: "{}",
  });
  return { success: true };
});
