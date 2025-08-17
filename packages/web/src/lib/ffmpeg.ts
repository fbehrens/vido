import { json } from "@sveltejs/kit";
import { makeDirFor } from "./utils";
import { exec } from "./utils";

export async function getDuration(videoPath: string): Promise<number> {
  let command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
  //   command = `mediainfo --Output='General;%Duration%' ${videoPath}`;
  const info = await exec(command);
  return Number(info.out);
}

export async function getFramerate(videoPath: string): Promise<number> {
  let command = `ffprobe -v 0 -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
  const info = await exec(command);
  // 30000/1001\n
  const m = info.out.match(/(\d+)\/(\d+)\n/);
  if (!m) {
    throw `${info.out} does not match pattern`;
  }
  return Number(m[1]) / Number(m[2]);
}

export async function extractMp3(filename: string, start: number, end: number, out: string) {
  makeDirFor(out);
  const start_arg = start == 0 ? "" : ` -ss ${start}`;
  const command = `ffmpeg${start_arg} -to ${end} -i "${filename}" -y -acodec libmp3lame -vn "${out}"`;
  console.log(command);
  const info = await exec(command);
}
