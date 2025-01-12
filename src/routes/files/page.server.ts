import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export interface MyFile {
  filename: string;
  size: number;
}

const dir = process.cwd() + "/static/";

function getAllFiles(dirPath: string, arrayOfFiles: MyFile[] = []) {
  const files = readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = join(dirPath, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push({
        filename: filePath.replace(dir, ""),
        size: stat.size,
      });
    }
  });
  return arrayOfFiles;
}
const extsVideo = [".mov", ".mp4", ".mkv"];
export async function load({}) {
  const files = getAllFiles(dir).filter((f) => extsVideo.includes(f.filename));
  // const join: FileWithMovie[] = files.map((m) => {
  //   const mc_ = mc.find((e) => e.filename === m.filename) || { clips: [] };
  //   return { ...m, ...mc_ };
  // });

  return {
    files,
  };
}
