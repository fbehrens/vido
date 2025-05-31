import { readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

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
const extsVideo = [".mov", ".mp4", ".mkv", ".json"];
export async function load({ params }) {
  console.log({ dir });
  const files = getAllFiles(dir).filter((f) =>
    extsVideo.includes(extname(f.filename)),
  );

  return {
    files,
  };
}
