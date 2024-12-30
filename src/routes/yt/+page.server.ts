import { dbOld } from "$lib/db";
import { db } from "$lib/server/db";
import { captions, movies, youtube } from "$lib/server/db/schema.js";
import { ytGetId, YtInfo } from "$lib/yt";
import { ytGetInfo } from "$lib/server/yt";

export async function load({ params }) {
  const yts = (await db.select({ info: youtube.info }).from(youtube)).map(
    ({ info }) => {
      const { id, title, description, duration } = new YtInfo(info).json;
      return { id, title, description, duration };
    },
  );
  return { yts };
}

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const url = formData.get("url") as string;
    const youtubeId = ytGetId(url);
    if (!youtubeId) return;
    const info = await ytGetInfo(youtubeId);
    const yt = new YtInfo(info).json;
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
      })
      .returning({ movie_id: movies.id })
      .get();

    const captions_url = yt.automatic_captions[yt.language];
    const json3Url: string = captions_url.find((c) => c.ext == "json3")!.url;
    const response = await fetch(json3Url);
    if (!response.ok) throw "Error fetching json3";
    const data = await response.text();
    await db.insert(captions).values({
      movieId,
      data,
      typ: "json3",
    });
  },
};
