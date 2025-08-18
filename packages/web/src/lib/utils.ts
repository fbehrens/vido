import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import type z from "../../node_modules/zod/v3/external.cjs";
import type { whisperApiSchema } from "./zod-schema";

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

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
} /**
 * calc Segment from WhisperApi
 * @param wa WhisperApi
 * @returns
 */

export function calcSegments(wa: z.infer<typeof whisperApiSchema>) {
  const words = wa.words;
  const pattern = new RegExp(`^\\s*[${Letters}]+[${NonLetters}]*`);
  const r = wa.segments.map((segment) => {
    const segment_words = [];
    let text = segment.text;
    while (text.length > 0) {
      if (words.length == 0) throw new Error("running out ouf words");
      const word = words.shift()!;
      const m = text.match(pattern);
      if (m == undefined) throw new Error(`cannot find pattern in "${text}"`);
      const ws_w_sp = m[0];
      if (!ws_w_sp.includes(word.word)) throw new Error(`"${word.word}" is not in "${ws_w_sp}"`);
      text = text.substring(ws_w_sp.length);
      segment_words.push({ ...word, word: ws_w_sp });
    }
    console.assert(segment_words.map((w) => w.word).join("") == segment.text);
    return { ...segment, words: segment_words };
  });

  return r;
}
export const NonLetters = "\\?\\.,-";
export const Letters = "A-Za-z";
const AllowedChars = new RegExp(`[${Letters} ${NonLetters}]`);

export const unexpectedChars = ({
  text,
  allowedChars = AllowedChars,
}: {
  text: string;
  allowedChars?: RegExp;
}) => {
  const s = new Set([...text]);
  const chars = [...s].filter((c) => !allowedChars.test(c));
  return new Set(chars);
};
