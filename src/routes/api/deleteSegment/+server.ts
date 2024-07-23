import { json } from "@sveltejs/kit";
import { db } from "$lib/db";
export async function POST({ request, cookies }) {
  const segment = await request.json();
  const deletions = {
    segments: db.prepare("delete from segments where id=@id").run(segment)
      .changes,
    words: db.prepare("delete from words where segment_id=@id").run(segment)
      .changes,
  };
  return json({ deletions });
}
