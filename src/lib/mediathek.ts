import { createReadStream, createWriteStream, ReadStream } from "fs";
import fs from "fs/promises";
import * as lzma from "lzma-native";
import { Readable } from "stream";

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
    await decompressFilmeJson();
  }
  return !equal;
}

const decompressFilmeJson = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const decompressor = lzma.createDecompressor();
    const input = createReadStream(filmlistePath);
    const output = createWriteStream(filmlisteJson);
    input
      .pipe(decompressor)
      .pipe(output)
      .on("end", () => resolve())
      .on("error", reject);
  });
};

export function createReadable(str: string) {
  return new Readable({
    read() {
      this.push(str);
      this.push(null);
    },
  });
}

export async function parseFilme(path: string = filmlisteJson) {
  let json = await fs.readFile(path, { encoding: "utf8" });
  json = json.slice(1, -1);
  const [_, liste, felder, ...filme] = json.split(/,?"(?:X|Filmliste)":/);
  // ["Sender","Thema","Titel","Datum","Zeit","Dauer","Größe [MB]","Beschreibung","Url","Website","Url Untertitel","Url RTMP","Url Klein","Url RTMP Klein","Url HD","Url RTMP HD","DatumL","Url History","Geo","neu"]
  let mapper = () => {
    let sender = "",
      thema = "";
    return (line: string) => {
      const [
        s,
        t,
        titel,
        datum,
        zeit,
        dauer,
        mb,
        beschreibung,
        url,
        website,
        captions,
        urlRtmp,
        urlLD,
        urlRtmpLD,
        urlHD,
        urlRtmpHD,
        datumL,
        urlHistory,
        geo,
        neu,
      ] = JSON.parse(line);
      sender = s || sender;
      thema = t || thema;
      return {
        sender,
        thema,
        titel,
        datum,
        zeit,
        dauer,
        mb,
        beschreibung,
        url,
        website,
        captions,
        urlRtmp,
        urlLD,
        urlRtmpLD,
        urlHD,
        urlRtmpHD,
        datumL,
        urlHistory,
        geo,
        neu,
      };
    };
  };
  console.log(felder);
  return filme.map(mapper());
}
