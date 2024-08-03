export interface Movie {
  filename: string;
  duration: number;
  id: number;
  create: boolean;
}

export type Artefact = "mp3" | "text" | "words" | "segments";

export interface Duration {
  start: number;
  end: number;
}

export interface Clip extends Duration {
  id: number;
  text: string;
  transcript: string;
  segments: string;
}

export interface Word extends Duration {
  clip_id: number;
  word: string;
  sep: string;
}

export interface Segment extends Duration {
  clip_id: number;
  text: string;
  words: Word[];
}

export interface SegmentAll extends Segment {
  seek: number;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
}

export type Json3Seg = {
  utf8: string;
  tOffsetMs?: number;
  acAsrConf: number;
};

export type Json3Event1 = {
  tStartMs: number;
  dDurationMs: number;
  id: number; // 1
  wpWinPosId: number;
  wsWinStyleId: number;
};
export type Json3Event = {
  tStartMs: number;
  dDurationMs: number;
  wWinId: number; // 1
  segs: Json3Seg[];
  aAppend?: number; // all odd 1 => segs[0].utf8 = '\n'
};
