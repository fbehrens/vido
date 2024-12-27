import { dbOld } from "$lib/db";
import { db } from "$lib/server/db/index.js";
import { eq } from "drizzle-orm";
import { youtube } from "$lib/server/db/schema.js";
import { YtInfo } from "$lib/yt.js";

export async function load({ params }) {
  const yt = db
    .select({ info: youtube.info, json3: youtube.json3 })
    .from(youtube)
    .where(eq(youtube.id, params.id))
    .get()!;

  const info = new YtInfo(yt.info!).json;
  let { title, description, duration, chapters, automatic_captions } = info;
  chapters = chapters || [];
  const cc = Object.entries(automatic_captions).map(([k, v]) => k);
  return { json3: yt.json3, title, description, duration, chapters };
}
