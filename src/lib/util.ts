import path from "path";
import * as fs from "fs";
export function makeDirFor(filepath: string): void {
  const dir = path.dirname(filepath);
  fs.mkdirSync(dir, { recursive: true });
}

export function getFileDir(filePath: string): string {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, path.extname(filePath));
  return path.join(dir, base);
}

const flatten = <T>(arr: T[][]): T[] =>
  arr.reduce((acc, val) => acc.concat(val), []);
