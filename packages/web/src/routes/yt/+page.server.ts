import { dbOld } from "$lib/db";
import { db } from "$lib/server/db";
import { captions, movies } from "$lib/server/db/schema.js";
import { ytGetId, ytInfo } from "$lib/yt";
import { ytGetInfo } from "$lib/server/yt";
import { isNotNull } from "drizzle-orm";

export async function load({ params }) {
  const yts = await db
    .select({ id: movies.id, youtubeId: movies.youtubeId, title: movies.title })
    .from(movies)
    .where(isNotNull(movies.youtubeId));
  return { yts };
}

export const actions = {
  default: async ({ request }) => {
    console.log({ page: `/yt?/default` });
    const formData = await request.formData();
    const url = formData.get("url") as string;
    const youtubeId = ytGetId(url);
    if (!youtubeId) {
      console.log({ err: `Do not have youtubeId`, url });
      return;
    }
    const info = await ytGetInfo(youtubeId);
    const yt = ytInfo(info);
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

    const languages = Object.keys(yt.automatic_captions);
    const language = languages.includes(yt.language!)
      ? yt.language!
      : languages[0]!;
    const cs = yt.automatic_captions[language];
    const csJson3 = cs.find((c) => c.ext == "json3");
    if (!csJson3) {
      console.log({ err: `Do not have json3 in lang=${language}`, cs });
      return;
    }
    const json3Url: string = csJson3.url;
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
