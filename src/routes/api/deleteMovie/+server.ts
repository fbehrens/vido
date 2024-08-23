import { json } from "@sveltejs/kit";
import { db } from "$lib/db";
export async function POST({ request, cookies }) {
  const { id } = await request.json();

  const result = {
    movie: db.prepare(`delete from movies where id= ?`).run(id).changes,
    clips: db.prepare(`delete from clips where movie_id= ?`).run(id).changes,
  };
  console.log(result);
  return json(result);
}
