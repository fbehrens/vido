import { command, form, query } from "$app/server";
import { db } from "$lib/server/db";
import { captions, movies } from "$lib/server/db/schema/vido";
import { ytGetInfo } from "$lib/server/yt";
import { sqliteDate } from "$lib/server/utils";
import { get_json3_url, ytGetId, ytInfo } from "$lib/yt";
import { error } from "@sveltejs/kit";
import { eq, sql, isNotNull, desc } from "drizzle-orm";
import * as v from "valibot";

export const getYoutube = query(async () => {
  console.log("getMovies");
  const yt = await db
    .select({ id: movies.id, youtubeId: movies.youtubeId, title: movies.title })
    .from(movies)
    .where(isNotNull(movies.youtubeId))
    .orderBy(desc(movies.created_at));
  return yt;
});

// export const getPost = query(v.string(), async (slug) => {
// 	const [pos] = await db.select().from(post).where(eq(post.slug, slug));
// 	if (!pos) error(404, 'Not found');
// 	return pos;
// });

export const createYoutube = form(async (data) => {
  const url = data.get("url") as string;
  console.log({ url });

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

  //   await db.insert(movies).values({ youtubeId: "foo", title: "t", duration: 1.1 });
  return { success: true };
});

// export const addLike = command(v.string(), async (slug) => {
// 	await db
// 		.update(post)
// 		.set({
// 			likes: sql`${post.likes} + 1`
// 		})
// 		.where(eq(post.slug, slug));
// 	// getPosts().refresh();
// });
