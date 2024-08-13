import { db } from "$lib/db";
import type { Movie } from "$lib/types.js";

export async function load({ params }) {
  console.log({ serverload: params });
  const { id } = params;
  const movie = db
    .prepare("Select * FROM movies where id = ?")
    .get(id) as Movie;
  return { movie };
}
