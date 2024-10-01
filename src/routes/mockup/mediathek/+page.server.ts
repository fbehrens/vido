import { parseFilme, updateFilmliste } from "$lib/mediathek.js";
import * as fs from "fs";
export async function load({ params, cookies }) {
  updateFilmliste();
  return {};
}
