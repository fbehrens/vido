import "dotenv/config";
import * as fs from "fs";
import { exec } from "./util";
import { decompress } from "@napi-rs/lzma/xz";
import { db_mediathek, dbPathMediathek } from "./db";
import {
  films,
  filmsPrev,
  mediathek,
} from "../../web/src/lib/server/db/schema/mediathek";
import { count, desc, sql } from "drizzle-orm";
import { con, getThemaId } from "./duck";

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
  console.log("decompress");
  buffer = (await decompress(buffer!)) as Buffer<ArrayBuffer>;
  //   let [buffer, etag] = [fs.readFileSync(filmeJson), undefined];
  const { info, lines } = parseJson(buffer);
  if (etag) {
    await db_mediathek.insert(mediathek).values({
      ...info,
      etag,
      createdAt: Date.now(),
    });
  }
  console.log(lines.length);
  await importLines(lines);
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
    etag === oldEtag ? undefined : new Uint8Array(await response.arrayBuffer());
  return { etag, buffer };
};

const parseJson = (buffer: Uint8Array) => {
  console.log(`parseJson`);
  let json = new TextDecoder("utf-8").decode(buffer);
  if (json.charAt(json.length - 1) != "}") {
    console.warn("Filmlist not ending with } (incomplete?) ");
  }
  json = json.slice(14, -2);
  const [liste, _, ...filme] = json.split(/\],?"(?:X|Filmliste)":\[/);
  // Liste ["07.09.2024, 09:35","07.09.2024, 07:35","3","MSearch [Vers.: 3.1.238]","22ae3b493eb73e562ffdadd00b71a743"]
  // sender,thema,titel,datum,zeit,dauer,mb,beschreibung,url,website,captions,urlRtmp,urlLD,urlRtmpLD,urlHD,urlRtmpHD,datumL,urlHistory,geo,neu";
  const [local, utc, nr, version, hash] = JSON.parse(`[${liste}]`);

  const mapper = () => {
    let counter = 0,
      sender = "",
      thema = "";
    return (line: string) => {
      line = line.replaceAll('\\"', '""'); // \"  -> ""
      line = line.slice(1);
      const [s, t, ...rest] = line.split('","');
      sender = s || sender;
      thema = t || thema;
      return `${counter++},"${sender}","${thema}","${rest.join('","')}`;
    };
  };
  const m = mapper();

  return {
    info: { local, utc, nr, version, hash },
    lines: filme.map(m),
  };
};

const importLines = async (lines: string[]) => {
  fs.writeFileSync(filmeCsv, lines.join("\n"));
  await db_mediathek.delete(filmsPrev);
  await db_mediathek
    .insert(filmsPrev)
    .select(db_mediathek.select().from(films));
  await db_mediathek.delete(films);
  console.log("films -> films_prev");

  const insertCommand = `sqlite3 ${dbPathMediathek} ".import --csv ${filmeCsv} films"`;
  console.log(`run ${insertCommand}`);
  await exec(insertCommand);
  await db_mediathek.update(films).set({
    datum: sql`substr(datum, 7, 4) || '-' || substr(datum, 4, 2) || '-' || substr(datum, 1, 2)`,
  }); // YYYY--MM-DD
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
