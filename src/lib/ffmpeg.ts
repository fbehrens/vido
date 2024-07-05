import ffmpeg from "fluent-ffmpeg";
import { json } from "@sveltejs/kit";
import { makeDirFor } from "$lib/util";

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

export function extractMp3(
  filename: string,
  start: number,
  end: number,
  out: string,
) {
  makeDirFor(out);
  return new Promise((resolve, reject) => {
    try {
      ffmpeg(filename)
        .inputOptions([`-ss ${start}`, `-t ${end}`])
        .audioCodec("libmp3lame")
        .withNoVideo()
        .output(out)
        .on("end", function () {
          resolve(out);
        })
        .run();
    } catch (error) {
      reject(error);
    }
  });
}
