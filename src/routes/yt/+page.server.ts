import { db } from "$lib/db";
import { ytGetId, ytGetInfo } from "$lib/yt";

export async function load({ params }) {
  const yts = (
    db.prepare("select id,info from youtube").all() as {
      id: string;
      info: string;
    }[]
  ).map((yt) => {
    const info = JSON.parse(yt.info);
    const { title, description, duration } = info;
    return { ...yt, title, description, duration };
  });
  return { yts };
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const url = data.get("url") as string;
    const id = ytGetId(url);
    if (!id) return;
    const info = await ytGetInfo(id);
    db.prepare("insert into youtube (id,info) values (?,?)").run(id, info);
  },
};
