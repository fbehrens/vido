import { command, form, query } from "$app/server";
import { db } from "$lib/server/db";
import { movies } from "$lib/server/db/schema/vido";
import { error } from "@sveltejs/kit";
import { eq, sql, isNotNull } from "drizzle-orm";
import * as v from "valibot";

export const getYoutube = query(async () => {
  console.log("getMovies");
  const yt = await db
    .select({ id: movies.id, youtubeId: movies.youtubeId, title: movies.title })
    .from(movies)
    .where(isNotNull(movies.youtubeId));
  return yt;
});

// export const getPost = query(v.string(), async (slug) => {
// 	const [pos] = await db.select().from(post).where(eq(post.slug, slug));

// 	if (!pos) error(404, 'Not found');
// 	return pos;
// });

// export const createPost = form(async (data) => {
// 	const title = data.get('title');
// 	const content = data.get('content');
// 	if (typeof title !== 'string' || typeof content !== 'string') {
// 		error(400, 'Title and content are required');
// 	}
// 	const slug = title.toLowerCase().replace(/ /g, '-');
// 	await db.insert(post).values({ slug, title, content });
// 	return { success: true };
// });
// export const createBoringPost = form(async (data) => {
// 	const title = data.get('title');
// 	const content = 'is boring';
// 	if (typeof title !== 'string' || typeof content !== 'string') {
// 		error(400, 'Title and content are required');
// 	}
// 	const slug = title.toLowerCase().replace(/ /g, '-');
// 	await db.insert(post).values({ slug, title, content });
// 	return { success: true };
// });

// export const addLike = command(v.string(), async (slug) => {
// 	await db
// 		.update(post)
// 		.set({
// 			likes: sql`${post.likes} + 1`
// 		})
// 		.where(eq(post.slug, slug));
// 	// getPosts().refresh();
// });
