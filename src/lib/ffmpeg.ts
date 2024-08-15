import { json } from "@sveltejs/kit";
import { makeDirFor } from "$lib/util/util";
import { exec } from "./util/util";

export async function getDuration(videoPath: string): Promise<number> {
  let command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
  //   command = `mediainfo --Output='General;%Duration%' ${videoPath}`;
  const info = await exec(command);
  return Number(info.out);
}

export async function extractMp3(
  filename: string,
  start: number,
  end: number,
  out: string,
) {
  makeDirFor(out);
  const command = `ffmpeg -ss ${start} -to ${end} -i "${filename}" -y -acodec libmp3lame -vn "${out}"`;
  console.log(command);
  const info = await exec(command);
}
