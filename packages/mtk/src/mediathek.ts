import "dotenv/config";
import * as fs from "fs";
import { duck } from "./duck";
import { decompress } from "@napi-rs/lzma/xz";

export const columnMapping = {
  sender: "Sender",
  thema: "Thema",
  titel: "Titel",
  datum: "Datum",
  zeit: "Zeit",
  dauer: "Dauer",
  mb: "Größe [MB]",
  beschreibung: "Beschreibung",
  url: "Url",
  website: "Website",
  captions: "Url Untertitel",
  urlRtmp: "Url RTMP",
  urlLD: "Url Klein",
  urlRtmpLD: "Url RTMP Klein",
  urlHD: "Url HD",
  urlRtmpHD: "Url RTMP HD",
  datumL: "DatumL",
  urlHistory: "Url History",
  geo: "Geo",
  neu: "neu",
};
const dbColumns = Object.keys(columnMapping);

export const fileDir = "temp/",
  filmlisteXz = "https://liste.mediathekview.de/Filmliste-akt.xz",
  filmeXz = fileDir + "Filmliste-akt.xz",
  filmeJson = fileDir + "filmliste.json",
  filmeCsv = fileDir + "filmliste.csv";

export const updateFilmliste = async ({ force }: { force: boolean }) => {
  const oldEtag = await lastEtag();
  console.log({ oldEtag });
  let { etag, buffer } = await download({ force, oldEtag });
  if (!buffer) {
    return;
  }
  console.log(`decompress -> ${filmeJson}`);
  buffer = (await decompress(buffer!)) as Buffer<ArrayBuffer>;
  //   fs.writeFileSync(filmeJson, buffer);
  //   let [buffer, etag] = [fs.readFileSync(filmeJson), undefined];
  console.log(`parse -> ${filmeCsv}`);
  const { info, lines } = parseJson(buffer);
  console.log(`import ${lines.length} rows`);
  fs.writeFileSync(filmeCsv, lines.join("\n"));
  if (etag) {
    await insertInfo({
      ...info,
      etag,
    });
  }
  await csv2duck();
};

const download = async ({
  force,
  oldEtag,
}: {
  force: boolean;
  oldEtag: string;
}) => {
  const response = await fetch(filmlisteXz);
  const etag = response.headers.get("etag")!;
  console.log(`download ${oldEtag} => ${etag}`);
  const buffer =
    etag === oldEtag && !force
      ? undefined
      : new Uint8Array(await response.arrayBuffer());
  return { etag, buffer };
};

const mapper = () => {
  let sender: string,
    thema: string,
    id = 0;
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
    ] = line.slice(1).replace(`\",","`, `\", ","`).split('","');

    if (s) {
      sender = s;
    }
    if (t) {
      thema = t;
    }
    if (urlRtmpLD) {
      throw new Error(`new field urlRtmpLD=${urlRtmpLD}`);
    }
    if (urlRtmpHD) {
      throw new Error(`new field urlRtmpHD=${urlRtmpHD}`);
    }
    if (neu != `false"`) {
      console.warn(`neu is not false (${neu})`);
    }
    const datumzeit = datum
      ? datum!.slice(6) +
        "-" +
        datum!.slice(3, 5) +
        "-" +
        datum!.slice(0, 2) +
        " " +
        (zeit ? zeit : "00:00:00")
      : "";

    return `${id++},"${sender}","${thema}","${titel}","${datumzeit}","${dauer}",${mb},"${beschreibung}","${url}","${website}","${captions}","${urlRtmp}","${urlLD}","${urlHD}",${datumL},"${urlHistory}","${geo}"`;
  };
};

type FilmlisteInfo = {
  local: string;
  utc: string;
  nr: string;
  version: string;
  hash: string;
};
export const parseJson = (buffer: Uint8Array) => {
  let json = new TextDecoder("utf-8").decode(buffer);
  json = json.slice(14, -2);
  const [liste, _, ...filme] = json.split(/\],?"(?:X|Filmliste)":\[/);
  // Liste ["07.09.2024, 09:35","07.09.2024, 07:35","3","MSearch [Vers.: 3.1.238]","22ae3b493eb73e562ffdadd00b71a743"]
  // sender,thema,titel,datum,zeit,dauer,mb,beschreibung,url,website,captions,urlRtmp,urlLD,urlRtmpLD,urlHD,urlRtmpHD,datumL,urlHistory,geo,neu";
  const [local, utc, nr, version, hash] = JSON.parse(`[${liste}]`);
  const m = mapper();
  return {
    info: { local, utc, nr, version, hash } as FilmlisteInfo,
    lines: filme.map(m),
  };
};

export const csv2duck = async () => {
  console.log("import csv");
  await duck.run(`
    delete from filme;
    insert into filme SELECT * FROM read_csv('${filmeCsv}');`);
};

const lastEtag = async () => {
  const reader = await duck.runAndReadAll(
    "from import select etag order by local desc limit 1"
  );
  const [r] = reader.getRows();
  return r ? (r[0] as string) : "";
};

export const insertInfo = async (o: FilmlisteInfo & { etag: string }) => {
  const u = {
    ...o,
    createdAt: new Date().toISOString(),
    local: parseDate(o.local),
    utc: parseDate(o.utc),
  };
  const reader = await duck.runAndReadAll(
    "insert into import (createdAt, local, utc, nr, version, hash, etag) values ($createdAt, $local, $utc, $nr, $version, $hash, $etag)",
    u
  );
  console.log(`import ${JSON.stringify(u)}`);
};

export function parseDate(s: string) {
  const [datePart, timePart] = s.split(", ");
  const [day, month, year] = datePart!.split(".");
  const [hours, minutes] = timePart!.split(":");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
