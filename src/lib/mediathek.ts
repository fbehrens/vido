import { createReadStream } from "fs";
import fs from "fs/promises";
import * as lzma from "lzma-native";

const filmlisteUrl = "https://liste.mediathekview.de/Filmliste-akt.xz";
const filmlistePath = "static/mediathek/filme";
const filmlisteJson = "static/mediathek/filme.json";

export async function firstNUrl(n: number) {
  const response = await fetch(filmlisteUrl),
    reader = response.body!.getReader(),
    chunks = [];
  let bytesRead = 0;
  while (bytesRead < n) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    bytesRead += value.length;
    if (bytesRead >= n) {
      // If we've read more than 20 bytes, slice the last chunk
      const lastChunk = chunks[chunks.length - 1];
      chunks[chunks.length - 1] = lastChunk.slice(
        0,
        lastChunk.length - (bytesRead - n),
      );
      break;
    }
  }

  // Concatenate all chunks into a single Uint8Array
  const result = new Uint8Array(n);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  reader.cancel(); // Cancel the download of the remaining content
  return Buffer.from(result);
}

export async function downloadFilmliste() {
  console.log(`download ${filmlisteUrl}`);
  const response = await fetch(filmlisteUrl);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(filmlistePath, Buffer.from(buffer));
}

export async function firstNFile(n: number): Promise<Buffer> {
  const file = await fs.open(filmlistePath);
  try {
    const { buffer } = await file.read(Buffer.alloc(n), 0, n, 0);
    return buffer;
  } finally {
    await file.close();
  }
}
export async function updateFilmliste(checkFirstBytes: number = 30) {
  const equal =
    Buffer.compare(
      await firstNUrl(checkFirstBytes),
      await firstNFile(checkFirstBytes),
    ) === 0;
  if (!equal) {
    await downloadFilmliste();
  }
  return !equal;
}

const decompressFilme = (): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const decompressor = lzma.createDecompressor();
    const input = createReadStream(filmlistePath);
    const chunks: Buffer[] = [];

    input
      .pipe(decompressor)
      .on("data", (chunk: Buffer) => chunks.push(chunk))
      .on("end", () => resolve(Buffer.concat(chunks)))
      .on("error", reject);
  });
};

export async function parseFilme() {
  const buffer = await decompressFilme();
  const text = buffer.toString("utf-8");
  return text.slice(0, 300);
}
