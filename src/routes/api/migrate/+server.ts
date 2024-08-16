import { db } from "$lib/db";
import { getFramerate } from "$lib/ffmpeg";
import { json, type RequestEvent } from "@sveltejs/kit";
export async function GET(event: RequestEvent) {
  const ms = db.prepare("select filename from movies").all() as {
    filename: string;
  }[];
  for (const m of ms) {
    const framerate = await getFramerate(`static/${m.filename}`);
    db.prepare("update movies set framerate=? where filename=?").run(
      framerate,
      m.filename,
    );
    console.log({ framerate });
  }
  return json({ ms });
}
