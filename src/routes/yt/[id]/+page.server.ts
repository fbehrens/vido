import { db } from "$lib/db";

export function load({ params }) {
  const yt = db
    .prepare("select id,info from youtube where id=@id")
    .get(params) as {
    id: string;
    info: string;
  };
  const info = JSON.parse(yt.info);
  const { title, description, duration, chapters } = info;
  return { ...yt, info, title, description, duration, chapters };
}
