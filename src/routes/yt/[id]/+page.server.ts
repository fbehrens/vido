import { dbOld } from "$lib/db";
import { db } from "$lib/server/db/index.js";
import { eq } from "drizzle-orm";
import { youtube } from "$lib/server/db/schema.js";

export async function load({ params }) {
  const yt = db.select().from(youtube).where(eq(youtube.id, params.id)).get()!;
  console.log(yt);
  const info = JSON.parse(yt.info!);
  //   console.log(info);
  let { title, description, duration, chapters, automatic_captions } = info;
  chapters = chapters || [];
  const cc = Object.entries(automatic_captions).map(([k, v]) => k);
  //   console.log(automatic_captions.de.map((c) => c.ext));

  return { ...yt, title, description, duration, chapters };
}
