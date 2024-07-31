export interface Movie {
  filename: string;
  duration: number;
  id: number;
}

export type Artefact = "mp3" | "text" | "words" | "segments";

export interface Duration {
  id: number; // primary key
  start: number;
  end: number;
}

export interface Clip extends Duration {
  text: string;
}

export interface Word extends Duration {
  clip_id: number;
  segment_id: number;
  word: string;
  sep?: string;
}

export interface Segment extends Duration {
  clip_id: number;
  text: string;
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

export type Json3Event = {
  tStartMs: number;
  dDurationMs: number;
  segs?: Json3Seg[];
  id?: number;
  wpWinPosId: number;
  wsWinStyleId: number;
  wWinId?: number;
};
