import { createReadStream, createWriteStream } from "fs";
import fs from "fs/promises";
import * as lzma from "lzma-native";
import { db } from "./db";

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

export async function downloadFilmliste(
  url = filmlisteUrl,
  path = filmlistePath,
): Promise<void> {
  console.log(`download ${url}`);
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(path, Buffer.from(buffer));
}

const decompressFilmliste = (
  pathLzma = filmlistePath,
  pathJson = filmlisteJson,
): Promise<void> => {
  console.log(`decompress ${pathLzma} -> ${pathJson}`);
  return new Promise((resolve, reject) => {
    const decompressor = lzma.createDecompressor();
    const input = createReadStream(pathLzma);
    const output = createWriteStream(pathJson);
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
    await parseFilme({});
  } else {
    console.log("Filmliste is up to date");
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

function createFilmsTable() {
  db.exec(`DROP TABLE IF EXISTS films`);
  db.exec(`
  CREATE TABLE IF NOT EXISTS films (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    thema TEXT,
    titel TEXT,
    datum TEXT,
    zeit TEXT,
    dauer TEXT,
    mb REAL,
    beschreibung TEXT,
    url TEXT,
    website TEXT,
    captions TEXT,
    urlRtmp TEXT,
    urlLD TEXT,
    urlRtmpLD TEXT,
    urlHD TEXT,
    urlRtmpHD TEXT,
    datumL INTEGER,
    urlHistory TEXT,
    geo TEXT,
    neu TEXT
  )
`);
}

export async function parseFilme({
  path = filmlisteJson,
  bulkSql = true,
  step = 1000,
}) {
  if (bulkSql) createFilmsTable();
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
    return (line: string, i: number): Film | undefined => {
      if (!(i % step)) {
        process.stdout.write(i.toString() + " ");
      }
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
      const film = {
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
      if (bulkSql) {
        db.prepare(
          `
    INSERT INTO films (
      sender, thema, titel, datum, zeit, dauer, mb, beschreibung, url, website,
      captions, urlRtmp, urlLD, urlRtmpLD, urlHD, urlRtmpHD, datumL, urlHistory, geo, neu
    ) VALUES (
      @sender, @thema, @titel, @datum, @zeit, @dauer, @mb, @beschreibung, @url, @website,
      @captions, @urlRtmp, @urlLD, @urlRtmpLD, @urlHD, @urlRtmpHD, @datumL, @urlHistory, @geo, @neu
    )
  `,
        ).run(film);
        return undefined;
      } else {
        return film;
      }
    };
  };
  const f = bulkSql ? filme.forEach(mapper()) : filme.map(mapper());
  return f;
}
