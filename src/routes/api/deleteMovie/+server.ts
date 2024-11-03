import { json } from "@sveltejs/kit";
import { dbOld } from "$lib/db";
export async function POST({ request, cookies }) {
  const { id } = await request.json();

  const result = {
    movie: dbOld.prepare(`delete from movies where id= ?`).run(id).changes,
    clips: dbOld.prepare(`delete from clips where movie_id= ?`).run(id).changes,
  };
  console.log(result);
  return json(result);
}
