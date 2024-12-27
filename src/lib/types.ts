export interface Movie {
  filename: string;
  duration: number;
  id: number;
  create: boolean;
  segments: string;
}

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
