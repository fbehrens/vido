import { dbOld } from "$lib/db";
import type { Clip, Movie } from "$lib/types";

import { json, type RequestEvent } from "@sveltejs/kit";

export function GET(event: RequestEvent) {
  const id = event.url.searchParams.get("id");
  const movie = dbOld
    .prepare("select * from movies where id=?")
    .get(id) as Movie;
  const clips = dbOld
    .prepare("select * from clips where movie_id=?")
    .all(id) as Clip[];
  return json({ movie, clips });
}
