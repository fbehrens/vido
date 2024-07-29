import { promisify } from "util";
import { exec as exec_ } from "child_process";
const exec = promisify(exec_);

export async function ytGetInfo(id: string): Promise<string> {
  const info = await exec(
    `yt-dlp --skip-download --dump-json https://www.youtube.com/watch?v=${id}`,
  );
  return info.stdout;
}

export function ytGetId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    if (hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }

    if (hostname === "www.youtube.com" || hostname === "youtube.com") {
      if (urlObj.searchParams.has("v")) {
        return urlObj.searchParams.get("v");
      }

      if (urlObj.pathname.startsWith("/embed/")) {
        return urlObj.pathname.slice(7);
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}
