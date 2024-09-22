import { createReadStream, createWriteStream, ReadStream } from "fs";
import fs from "fs/promises";
import * as lzma from "lzma-native";

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

export async function firstNFile(n: number): Promise<string> {
  let file;
  try {
    file = await fs.open(filmlistePath);
    const { buffer } = await file.read(Buffer.alloc(n), 0, n, 0);
    return buffer.toString("hex");
  } catch (e) {
    console.log(`File does not exist ${e}`);
    return "--".repeat(n);
  } finally {
    if (file) {
      await file.close();
    }
  }
}

export async function downloadFilmliste(): Promise<void> {
  console.log(`download ${filmlisteUrl}`);
  const response = await fetch(filmlisteUrl);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(filmlistePath, Buffer.from(buffer));
}

const decompressFilmliste = (): Promise<void> => {
  console.log(`decompress ${filmlistePath} -> ${filmlisteJson}`);
  return new Promise((resolve, reject) => {
    const decompressor = lzma.createDecompressor();
    const input = createReadStream(filmlistePath);
    const output = createWriteStream(filmlisteJson);
    input
      .pipe(decompressor)
      .pipe(output)
      .on("finish", () => resolve())
      .on("error", reject);
  });
};

export async function updateFilmliste(
  checkFirstBytes: number = 30,
  force = false,
) {
  const equal =
    (await firstNUrl(checkFirstBytes)) == (await firstNFile(checkFirstBytes));
  if (!equal || force) {
    await downloadFilmliste();
    await decompressFilmliste();
  }
  return !equal;
}

interface Film {
  sender: string;
  thema: string;
  titel: string;
  datum: string;
  zeit: string;
  dauer: string;
  mb: Number;
  beschreibung: string;
  url: string;
  website: string;
  captions: string;
  urlRtmp: string;
  urlLD: string;
  urlRtmpLD: string;
  urlHD: string;
  urlRtmpHD: string;
  datumL: number;
  urlHistory: string;
  geo: string;
  neu: string;
}

export async function parseFilme(path: string = filmlisteJson) {
  let json = await fs.readFile(path, { encoding: "utf8" });
  if (json.charAt(json.length - 1) != "}") {
    console.warn("Filmlist not ending with } (incomplete?) ");
  }
  json = json.slice(1, -1);
  const [_, liste, felder, ...filme] = json.split(/,?"(?:X|Filmliste)":/);
  // ["07.09.2024, 09:35","07.09.2024, 07:35","3","MSearch [Vers.: 3.1.238]","22ae3b493eb73e562ffdadd00b71a743"]
  // ["Sender","Thema","Titel","Datum","Zeit","Dauer","Größe [MB]","Beschreibung","Url","Website","Url Untertitel","Url RTMP","Url Klein","Url RTMP Klein","Url HD","Url RTMP HD","DatumL","Url History","Geo","neu"]
  let mapper = () => {
    let sender = "",
      thema = "";
    return (line: string): Film => {
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
        mb: Number(mb),
        beschreibung,
        url,
        website,
        captions,
        urlRtmp,
        urlLD,
        urlRtmpLD,
        urlHD,
        urlRtmpHD,
        datumL: Number(datumL),
        urlHistory,
        geo,
        neu,
      };
    };
  };
  const f = filme.map(mapper());
  console.log(`${f.length} filme parsed`);
  return f;
}
