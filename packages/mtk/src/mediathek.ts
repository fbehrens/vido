import "dotenv/config";
import * as fs from "fs";
import { exec } from "./util";
import { db_mediathek, dbPathMediathek } from "./db";
import {
  films,
  filmsPrev,
  mediathek,
} from "../../web/src/lib/server/db/schema/mediathek";
import { count, desc, sql } from "drizzle-orm";
import { getDuck } from "./getDuck";
import { decompress } from "@napi-rs/lzma/xz";

export const columns = [
  "Sender",
  "Thema",
  "Titel",
  "Datum",
  "Zeit",
  "Dauer",
  "Größe [MB]",
  "Beschreibung",
  "Url",
  "Website",
  "Url Untertitel",
  "Url RTMP",
  "Url Klein",
  "Url RTMP Klein",
  "Url HD",
  "Url RTMP HD",
  "DatumL",
  "Url History",
  "Geo",
  "neu",
];

const fileDir = "temp/",
  filmlisteXz = "https://liste.mediathekview.de/Filmliste-akt.xz",
  filmeXz = fileDir + "Filmliste-akt.xz",
  filmeJson = fileDir + "filmliste.json",
  filmeCsv = fileDir + "filmliste.csv";

export const updateFilmliste = async ({ force }: { force: boolean }) => {
  const result = await db_mediathek
    .select()
    .from(mediathek)
    .orderBy(desc(mediathek.id))
    .get();
  const oldEtag = result?.etag || "";
  let { etag, buffer } = await download({ force, oldEtag });
  if (!buffer) {
    return;
  }
  console.log(`decompress -> ${filmeJson}`);
  buffer = (await decompress(buffer!)) as Buffer<ArrayBuffer>;
  //   let [buffer, etag] = [fs.readFileSync(filmeJson), undefined];
  console.log(`parse -> ${filmeCsv}`);
  const { info, lines } = parseJson(buffer);
  console.log(`import ${lines.length} rows`);
  fs.writeFileSync(filmeCsv, lines.join("\n"));
  if (etag) {
    await db_mediathek.insert(mediathek).values({
      ...info,
      etag,
      createdAt: Date.now(),
    });
  }
  //   await csv2sqlite();
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
    line = line.replaceAll('\\"', '""'); // \"  -> ""
    line = line.slice(1);
    const [s, t, ...rest] = line.split('","');
    if (s) {
      sender = s;
    }
    if (t) {
      thema = t;
    }
    return `${id++},"${sender}","${thema}","${rest.join('","')}`;
  };
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
    info: { local, utc, nr, version, hash },
    lines: filme.map(m),
  };
};

const csv2duck = async () => {
  const duck = await getDuck({});
  duck.run(`delete from filme;
insert into filme SELECT * FROM read_csv('${filmeCsv}');`);
};

const csv2sqlite = async () => {
  //   await db_mediathek.delete(filmsPrev);
  //   await db_mediathek
  //     .insert(filmsPrev)
  //     .select(db_mediathek.select().from(films));
  //   console.log("films -> films_prev");
  await db_mediathek.delete(films);
  const insertCommand = `sqlite3 ${dbPathMediathek} ".import --csv ${filmeCsv} films"`;
  console.log(`run ${insertCommand}`);
  await exec(insertCommand);
  //   await db_mediathek.update(films).set({
  //     datum: sql`substr(datum, 7, 4) || '-' || substr(datum, 4, 2) || '-' || substr(datum, 1, 2)`,
  //   }); // YYYY--MM-DD
  const c = await db_mediathek.select({ count: count() }).from(films).get();
  console.log(`imported ${c?.count} films`);
};

export function parseDate(s: string): Date {
  const [datePart, timePart] = s.split(", ");
  const [day, month, year] = datePart!.split(".");
  const [hours, minutes] = timePart!.split(":");
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes)
  );
}
