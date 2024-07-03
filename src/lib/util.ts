import path from "path";
import * as fs from "fs";
type Artefact = "mp3" | "text" | "words" | "segments";

export function makeDirFor(filepath: string): void {
  const dir = path.dirname(filepath);
  fs.mkdirSync(dir, { recursive: true });
}

export function artefactSave(
  filePath: string,
  a: Artefact,
  start: number,
  objects: any[] | string = [],
): string {
  // Get the directory name and base name
  const isJson = a === "words" || a === "segments";
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, path.extname(filePath));
  const extension = isJson ? "json" : a;
  const aPath = `${path.join(dir, base)}/${a}/${start}.${extension}`;
  if (a !== "mp3") {
    const s = typeof objects === "string" ? objects : JSON.stringify(objects);
    console.log({ action: "writeFileSync", aPath, s });
    makeDirFor(aPath);
    fs.writeFileSync(aPath, s);
  }
  return aPath;
}
