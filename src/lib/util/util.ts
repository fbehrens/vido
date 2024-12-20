import { exec as child_process_exec, type ExecException } from "child_process";
import path from "path";
import * as fs from "fs";

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

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

export const floor2 = (n: number) => Math.ceil(n * 100) / 100;

export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce(
    (groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );

export function nTimes(n: number, f: any, ...args: any[]) {
  for (let i = 0; i < n; i++) {
    f(...args);
  }
}

export function everyStep(step: number) {
  return {
    counter: 0,
    get count() {
      return this.counter;
    },
    start: performance.now(),
    elapsed() {
      return Math.round((performance.now() - this.start) / 1000);
    },
    tick() {
      this.counter++;
      if (this.counter % step === 0) {
        console.log(`${this.counter} ${this.elapsed()}s`);
      }
    },
  };
}
