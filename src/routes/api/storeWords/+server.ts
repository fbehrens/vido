import { json } from "@sveltejs/kit";
import { dbOld } from "$lib/db";
export async function POST({ request, cookies }) {
  const mwords = await request.json();
  mwords.forEach((mw: unknown) => {
    dbOld
      .prepare("UPDATE words SET segment_id=@segment_id, sep=@sep WHERE id=@id")
      .run(mw);
  });
  return json({ done: mwords.length });
}
