import { json } from "@sveltejs/kit";
import { db } from "$lib/db";
import { groupBy } from "$lib/util";

export async function POST({ request }) {
  const { ids } = (await request.json()) as { ids: number[] };
  const segments_ids = (
    db
      .prepare(
        `select distinct segment_id from words where id in (${ids.join(",")}) order by start`,
      )
      .all() as { segment_id: string }[]
  ).map((row) => row.segment_id);

  console.log({ ids, segments_ids });

  db.prepare(`delete from words where id in (${ids.join(",")})`).run();

  const words = db
    .prepare(
      `select id,segment_id,word,sep from words_v where segment_id in (${segments_ids.join(",")}) order by start`,
    )
    .all() as { id: number; segment_id: number; word: string; sep: string }[];

  const remaining = groupBy(words, (w: any) => w.segment_id);

  segments_ids.forEach((segment_id) => {
    const words = remaining[segment_id];
    if (words) {
      const text = words.reduce((acc, e) => `${acc} ${e.word}${e.sep}`, "");
      console.log({ segment_id, text });
      db.prepare("update segments set text = ? where id = ?").run(
        segment_id,
        text,
      );
    } else {
      db.prepare("delete from segments where id = ?").run(segment_id);
    }
  });

  //       .changes,
  //     clips: db.prepare(`delete from clips where movie_id= ?`).run(id).changes,
  return json("ok");
}
