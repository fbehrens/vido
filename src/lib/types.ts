export interface Movie {
  filename: string;
  id?: number;
  duration?: number;
}

export type Artefact = "mp3" | "text" | "words" | "segments";

export interface Word {
  clip_id: number;
  start: number;
  end: number;
  word: string;
  dublicate?: boolean;
}

export interface Segment {
  clip_id: number;
  start: number;
  end: number;
  text: string;
  dublicate: boolean;
  id: number;
  seek: number;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
}
