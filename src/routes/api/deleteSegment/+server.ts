import { json } from "@sveltejs/kit";
import { db } from "$lib/db";
export async function POST({ request, cookies }) {
  const segment = await request.json();
  const dbResult = db
    .prepare("delete from segments where clip=@clip and id=@id")
    .run(segment);
  return json({ deletions: dbResult.changes });
}
