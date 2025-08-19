import { type ExecException, exec as child_process_exec } from "child_process";
import * as fs from "fs";
import { readFileSync } from "fs";
import path from "path";

export function readFixture(file: string) {
  return readFileSync(file, "utf-8");
}
export function exec(command: string): Promise<{
  command: string;
  error: ExecException | null;
  out: string;
  err: string;
}> {
  return new Promise((resolve, reject) => {
    child_process_exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve({ error, command: command, out: stdout, err: stderr });
    });
  });
}
export const mp3Path = (filename: string, clip_id: number): string => {
  const fileDir = getFileDir(filename);
  return `${fileDir}/mp3/${clip_id}.mp3`;
};
export function makeDirFor(filepath: string): void {
  const dir = path.dirname(filepath);
  fs.mkdirSync(dir, { recursive: true });
}

export function getFileDir(filePath: string): string {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, path.extname(filePath));
  return path.join(dir, base);
}

export function sqliteDate(d: Date = new Date()) {
  return d.toISOString().replace("T", " ").replace("Z", "").split(".")[0];
}
