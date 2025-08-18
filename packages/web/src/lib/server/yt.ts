import { exec } from "./utils";

export async function ytGetInfo(id: string): Promise<string> {
  const info = await exec(
    `yt-dlp --skip-download --dump-json https://www.youtube.com/watch?v=${id}`,
  );
  return info.out;
}
