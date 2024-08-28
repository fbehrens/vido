import { db } from "$lib/db";

export async function load({ params }) {
  const yt = db
    .prepare(
      "select id,info,lang,json3 as 'json3text' from youtube where id=@id",
    )
    .get(params) as {
    id: string;
    info: string;
    json3text: string;
  };
  const info = JSON.parse(yt.info);
  let { title, description, duration, chapters, automatic_captions } = info;
  chapters = chapters || [];
  const cc = Object.entries(automatic_captions).map(([k, v]) => k);
  //   console.log(automatic_captions.de.map((c) => c.ext));

  return { ...yt, info, title, description, duration, chapters };
}
