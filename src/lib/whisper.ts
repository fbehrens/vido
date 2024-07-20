import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();
interface ExtendedTranscription extends OpenAI.Audio.Transcription {
  segments: any[];
  words: any[];
}

export async function transcribe(filename: string) {
  const transcription = await openai.audio.transcriptions.create({
    // language: 'de', https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
    file: fs.createReadStream(filename),
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["word", "segment"],
  });

  const { text, segments, words } = transcription as ExtendedTranscription;
  return { text, segments, words };
}
