import { readdir, stat } from "fs/promises";
import { Stats, readdirSync, statSync } from "fs";
import { join } from "path";

interface MyFile {
  file: string;
  isVdo: boolean;
  size: number;
}

function myFile(name: string, stat: Stats): MyFile {
  const filePattern = /\.(mov|mp4)$/i;
  return {
    file: name,
    isVdo: filePattern.test(name),
    size: stat.size,
  };
}

function getAllFiles(dirPath: string, arrayOfFiles: MyFile[] = []): MyFile[] {
  const files = readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = join(dirPath, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(myFile(filePath, stat));
    }
  });
  return arrayOfFiles;
}

export async function load({}) {
  const dir = process.cwd() + "/static";
  const files = getAllFiles(dir);
  return { files };
}
