import { json } from "@sveltejs/kit";
import { db } from "$lib/db";
export async function POST({ request, cookies }) {
  const { id } = await request.json();

  const result = {
    words: db.prepare(`delete from words where movie_id= ?`).run(id).changes,
    segments: db.prepare(`delete from segments where movie_id= ?`).run(id)
      .changes,
    clips: db.prepare(`delete from clips where movie_id= ?`).run(id).changes,
  };
  return json(result);
}
