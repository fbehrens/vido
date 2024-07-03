import path from "path";
import * as fs from "fs";
import type { Artefact, Segment, Word } from "$lib/types";
export function makeDirFor(filepath: string): void {
  const dir = path.dirname(filepath);
  fs.mkdirSync(dir, { recursive: true });
}

export function fileDir(filePath: string): string {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, path.extname(filePath));
  return path.join(dir, base);
}

const flatten = <T>(arr: T[][]): T[] =>
  arr.reduce((acc, val) => acc.concat(val), []);

export function artefactSave(
  filePath: string,
  a: Artefact,
  start: number,
  objects: any[] | string = [],
): string {
  // Get the directory name and base name
  const extension = a === "words" || a === "segments" ? "json" : a;
  const aPath = `${fileDir(filePath)}/${a}/${start}.${extension}`;
  if (a !== "mp3") {
    const s = typeof objects === "string" ? objects : JSON.stringify(objects);
    console.log({ action: "writeFileSync", aPath, s });
    makeDirFor(aPath);
    fs.writeFileSync(aPath, s);
  }
  return aPath;
}

export function artefactLoad<T>(filePath: string, a: Artefact): T[] {
  // Get the directory name and base name
  const dir = `${fileDir(filePath)}/${a}`;
  const files = fs
    .readdirSync(dir)
    .filter((file) => path.extname(file).toLowerCase() === ".json")
    .map((f) => {
      const start = Number(path.parse(f).name);
      const content = fs.readFileSync(`${dir}/${f}`, "utf8");
      const artefacts = JSON.parse(content);
      if (a === "words") {
        return artefacts.map((ar: any) => {
          return {
            start: ar.start + start,
            end: ar.end + start,
            text: ar.word,
          } as Word;
        });
      }

      return artefacts.map((ar: any) => {
        ar.start += start;
        ar.end += start;
        return ar as Segment;
      });
    });
  return flatten(files);
}
