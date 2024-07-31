import ffmpeg from "fluent-ffmpeg";
import { json } from "@sveltejs/kit";
import { makeDirFor } from "$lib/util";
import { exec } from "./util/util";

export function getDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;
        resolve(duration!);
      }
    });
  });
}

export async function extractMp3(
  filename: string,
  start: number,
  end: number,
  out: string,
) {
  makeDirFor(out);
  const command = `ffmpeg -ss ${start} -t ${end} -i ${filename} -y -acodec libmp3lame -vn ${out}`;
  const info = await exec(command);
  console.log({ command, output: info.stderr });
}
