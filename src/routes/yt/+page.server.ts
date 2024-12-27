import { dbOld } from "$lib/db";
import { db } from "$lib/server/db";
import { youtube } from "$lib/server/db/schema.js";
import { ytGetId, YtInfo } from "$lib/yt";
import { ytGetInfo } from "$lib/server/yt";

export async function load({ params }) {
  const yts = (await db.select({ info: youtube.info }).from(youtube)).map(
    ({ info }) => {
      const { id, title, description, duration } = new YtInfo(info).json;
      return { id, title, description, duration };
    },
  );
  return { yts };
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const url = data.get("url") as string;
    const id = ytGetId(url);
    if (!id) return;
    const info = await ytGetInfo(id);
    const yt = new YtInfo(info).json;

    const lang = "en";
    const captions = yt.automatic_captions[lang];
    const json3Url: string = captions.find((c) => c.ext == "json3")!.url;
    const response = await fetch(json3Url);
    if (!response.ok) throw "Error fetching json3";
    const json3 = await response.text();
    await db.insert(youtube).values({
      id,
      info,
      lang,
      json3,
    });
  },
};
