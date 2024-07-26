import { db } from "$lib/db";
export function load({ params }) {
  const texts = db.prepare("SELECT text FROM segments").all() as {
    text: string;
  }[];
  return {
    texts: texts.map((row) => row.text),
  };
}
