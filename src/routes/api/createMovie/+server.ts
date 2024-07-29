import { json, redirect } from "@sveltejs/kit";
import { db } from "$lib/db";
import { getDuration } from "$lib/ffmpeg.js";
export async function POST({ request }) {
  const { filename } = await request.json();

  db.prepare(
    "INSERT OR IGNORE INTO movies (filename,duration) VALUES (?,?)",
  ).run(filename, await getDuration(`static/${filename}`));
  const { id } = db
    .prepare("select id from movies where filename=?")
    .get(filename) as { id: number };
  return json({ id });
}
