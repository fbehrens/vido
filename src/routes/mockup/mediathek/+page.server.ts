import { parseFilme } from "$lib/mediathek.js";
import * as fs from "fs";
export async function load({ params, cookies }) {
  const filme = await parseFilme()
  console.log(filme[0])
  return { filme: filme.slice(0,1000000) };
}
