import { dbOld } from "$lib/db";
import { ytGetId, ytGetInfo } from "$lib/yt";

export async function load({ params }) {
  const yts = (
    dbOld.prepare("select id,info from youtube").all() as {
      id: string;
      info: string;
    }[]
  ).map((yt) => {
    const info = JSON.parse(yt.info);
    const { title, description, duration } = info;
    return { ...yt, title, description, duration };
  });
  yts.forEach((yt) => console.log(yt.title));
  return { yts };
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const url = data.get("url") as string;
    const id = ytGetId(url);
    if (!id) return;
    const info = await ytGetInfo(id);
    const { automatic_captions } = JSON.parse(info);

    const lang = "en";
    const json3Url = automatic_captions[lang].find((c) => c.ext == "json3").url;
    const response = await fetch(json3Url);
    if (!response.ok) throw "Error fetching json3";
    const json3 = await response.text();
    dbOld
      .prepare("insert into youtube   values (?,?,?,?)")
      .run(id, info, lang, json3);
  },
};
