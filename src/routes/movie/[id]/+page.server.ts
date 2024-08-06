import { db } from "$lib/db";
import type { Clip, Movie, Segment, Word } from "$lib/types.js";
import { getFileDir } from "$lib/util";
import { extractMp3 } from "$lib/ffmpeg.js";
import { transcribe } from "$lib/whisper";
import * as fs from "fs";

export async function load({ params }) {
  console.log({ serverload: params });
  const { id } = params;
  const movie = db
    .prepare("Select * FROM movies where id = ?")
    .get(id) as Movie;
  return { movie };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
