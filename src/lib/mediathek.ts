import * as fs from "fs";
import { exec } from "$lib/util/util";

const filmlisteUrl = "https://liste.mediathekview.de/Filmliste-akt.xz";

const filmlistePath = "static/mediathek/filme";
const filmlisteJson = "static/mediathek/filme.json";

//  deno --allow-net --allow-write --allow-read --allow-env --allow-ffi --allow-run src/mediathek.ts
import { decompress } from "@napi-rs/lzma/xz";
import { db, dbPath } from "./server/db";
import { films, filmsImport, mediathek } from "./server/db/schema";
import { count } from "drizzle-orm";

const fileDir = "static/mediathek/",
  filmeJson = fileDir + "filmliste.json",
  filmeEtag = fileDir + "etag",
  readEtag = async () => {
    try {
      const etag = await fs.readFileSync(filmeEtag, "utf-8");
      return etag;
    } catch {
      return "";
    }
  };
let filmeCsv = fileDir + "filmliste.csv";
export async function updateFilmliste({
  force = false,
  test = false,
  skipDownload = false,
}) {
  if (!skipDownload) {
    if (!test) {
      const response = await fetch(
        "https://liste.mediathekview.de/Filmliste-akt.xz",
      );
      const etag = response.headers.get("etag")!,
        oldEtag = await readEtag();
      console.log({ etag, oldEtag });
      if (etag === oldEtag) {
        console.log("no update");
        if (!force) return;
      }
      await fs.writeFileSync(filmeEtag, etag, "utf-8");
      console.log(`download new etag ${etag}`);
      const buffer = new Uint8Array(await response.arrayBuffer());
      console.log(`decompress xz`);
      const bytes = await decompress(buffer);
      //   await Deno.writeFile(filmeJson, bytes);
      const filme = parseFilme({ bytes });
      const { value: liste } = filme.next();
      const [local, utc, nr, version, hash] = <any[]>liste;
      try {
        db.insert(mediathek).values({ local, utc, nr, version, hash });
      } catch (e) {
        console.log(e);
      }
      console.log(`create ${filmeCsv}`);
      let csv = "";
      for (const f of filme) {
        csv += f + "\n";
      }
      fs.writeFileSync(filmeCsv, csv);
    } else {
      console.log(`test mode`);
      const _filmeCsv = filmeCsv;
      filmeCsv = filmeCsv.replace(".csv", ".test.csv");
      await exec(`head -n 100 ${_filmeCsv} > ${filmeCsv}`);
    }
  }
  // import
  await db.delete(filmsImport);
  const insertCommand = `sqlite3 ${dbPath} ".import --csv ${filmeCsv} films_import"`;
  console.log(`run ${insertCommand}`);
  await exec(insertCommand);
  await db.delete(films);
  await db.insert(films).select(db.select().from(filmsImport));
  const c = await db.select({ count: count() }).from(films).get();
  console.log(`imported ${c!.count} films`);
}

// yields a record with timestamps of list and then all
export function* parseFilme({ path = "", bytes = Buffer.alloc(0) }) {
  let json;
  if (path) {
    json = fs.readFileSync(path, "utf-8");
  } else {
    json = new TextDecoder("utf-8").decode(bytes);
  }
  if (json.charAt(json.length - 1) != "}") {
    console.warn("Filmlist not ending with } (incomplete?) ");
  }
  json = json.slice(14, -2);
  const [liste, _, ...filme] = json.split(/\],?"(?:X|Filmliste)":\[/);
  // Liste ["07.09.2024, 09:35","07.09.2024, 07:35","3","MSearch [Vers.: 3.1.238]","22ae3b493eb73e562ffdadd00b71a743"]
  // sender,thema,titel,datum,zeit,dauer,mb,beschreibung,url,website,captions,urlRtmp,urlLD,urlRtmpLD,urlHD,urlRtmpHD,datumL,urlHistory,geo,neu";
  const [local, utc, nr, version, hash] = JSON.parse(`[${liste}]`);
  yield [local, utc, nr, version, hash];

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
  for (const f of filme) {
    yield m(f);
  }
}

export function parseDate(s: string): Date {
  const [datePart, timePart] = s.split(", ");
  const [day, month, year] = datePart.split(".");
  const [hours, minutes] = timePart.split(":");
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
  );
}
