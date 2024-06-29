import { readdir, stat } from "fs/promises";

interface MyFile {
  file: string;
  isDir: boolean;
}
export function _myCompare(a: MyFile, b: MyFile): number {
  if (a.isDir === b.isDir) {
    return a.file.localeCompare(b.file);
  }
  return a.isDir ? -1 : 1;
}

const dir = process.cwd();
async function getFile(file: string): Promise<MyFile> {
  const stats = await stat(`${dir}/${file}`);
  return {
    isDir: stats.isDirectory(),
    file,
  };
}

export async function load({}) {
  const f = await readdir(".");
  const files = await Promise.all(f.map(getFile));
  files.sort(_myCompare);
  return { files };
}
