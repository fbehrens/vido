import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { readFileSync } from "fs";
import { type ExecException, exec as child_process_exec } from "child_process";
import * as fs from "fs";
import path from "path";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 },
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;

  const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (style: Record<string, number | string | undefined>): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, "");
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};
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

export function sqliteDate(d: Date = new Date()) {
  return d.toISOString().replace("T", " ").replace("Z", "").split(".")[0];
}
