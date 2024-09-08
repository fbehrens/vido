import { createReadStream, createWriteStream, ReadStream } from "fs";
import fs from "fs/promises";
import * as lzma from "lzma-native";
import { Readable } from "stream";

const filmlisteUrl = "https://liste.mediathekview.de/Filmliste-akt.xz";
const filmlistePath = "static/mediathek/filme";
const filmlisteJson = "static/mediathek/filme.json";

export async function firstNUrl(n: number) {
  const response = await fetch(filmlisteUrl),
    reader = response.body!.getReader();
  let hex = "";
  while (hex.length < 2 * n) {
    const { done, value } = await reader.read();
    if (done) break;
    hex += Buffer.from(value).toString("hex");
  }
  reader.cancel(); // Cancel the download of the remaining content
  return hex.slice(0, 2 * n);
}

export async function firstNFile(n: number) {
  const file = await fs.open(filmlistePath);
  try {
    const { buffer } = await file.read(Buffer.alloc(n), 0, n, 0);
    return buffer.toString("hex");
  } finally {
    await file.close();
  }
}

export async function downloadFilmliste() {
  console.log(`download ${filmlisteUrl}`);
  const response = await fetch(filmlisteUrl);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(filmlistePath, Buffer.from(buffer));
}

export async function updateFilmliste(
  checkFirstBytes: number = 30,
  force = false,
) {
  const equal =
    (await firstNUrl(checkFirstBytes)) == (await firstNFile(checkFirstBytes));
  if (!equal || force) {
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

export async function parseFilme(path: string = filmlisteJson) {
  let json = await fs.readFile(path, { encoding: "utf8" });
  if (json.charAt(json.length - 1) != "}") {
    console.warn("Filmlist not ending with } (incomplete?) ");
  }
  json = json.slice(1, -1);
  const [_, liste, felder, ...filme] = json.split(/,?"(?:X|Filmliste)":/);
  // ["Sender","Thema","Titel","Datum","Zeit","Dauer","Größe [MB]","Beschreibung","Url","Website","Url Untertitel","Url RTMP","Url Klein","Url RTMP Klein","Url HD","Url RTMP HD","DatumL","Url History","Geo","neu"]
  //   console.log({ liste, felder });
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
  return filme.map(mapper());
}
