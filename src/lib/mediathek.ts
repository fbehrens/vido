import * as fs from "fs";
import { db, dbFilmsPath, dbFilms } from "$lib/db";
import { exec } from "$lib/util/util";

const filmlisteUrl = "https://liste.mediathekview.de/Filmliste-akt.xz";

const filmlistePath = "static/mediathek/filme";
const filmlisteJson = "static/mediathek/filme.json";

//  deno --allow-net --allow-write --allow-read --allow-env --allow-ffi --allow-run src/mediathek.ts
import { decompress } from "@napi-rs/lzma/xz";

const fileDir = "static/mediathek/",
  filmeJson = fileDir + "filmliste.json",
  filmeCsv = fileDir + "filmliste.csv",
  filmeEtag = fileDir + "etag",
  readEtag = async () => {
    try {
      const etag = await fs.readFileSync(filmeEtag, "utf-8");
      return etag;
    } catch {
      return "";
    }
  };

export async function updateFilmliste() {
  const response = await fetch(
    "https://liste.mediathekview.de/Filmliste-akt.xz",
  );
  const etag = response.headers.get("etag")!;
  if (etag === (await readEtag())) {
    console.log("no update");
    return;
  }
  await fs.writeFileSync(filmeEtag, etag, "utf-8");
  console.log(`download new etag ${etag}`);
  const buffer = new Uint8Array(await response.arrayBuffer());
  console.log(`decompress xz`);
  const bytes = await decompress(buffer);
  //   await Deno.writeFile(filmeJson, bytes);
  const filme = parseFilme({ bytes });
  await insertFilme(filme);
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

async function insertFilme(filme: any) {
  const { value: liste } = filme.next();
  try {
    db.prepare(
      `INSERT INTO mediathek ( local , utc , nr , version , hash ) VALUES ( ?,?,?,?,? )`,
    ).run(liste);
  } catch (e) {
    console.log(e);
  }
  console.log(`create ${filmeCsv}`);
  let csv = "";
  for (const f of filme) {
    csv += f + "\n";
  }
  fs.writeFileSync(filmeCsv, csv);
  dbFilms.exec(`delete from import`);
  const insertCommand = `sqlite3 ${dbFilmsPath} ".import --csv ${filmeCsv} import"`;
  console.log(`run ${insertCommand}`);
  await exec(insertCommand);
  dbFilms.exec(`delete from films; insert into films select * from import`);
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
