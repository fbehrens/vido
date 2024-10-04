import { createReadStream, createWriteStream } from "fs";
import fs_p from "fs/promises";
import * as fs from "fs";
import * as lzma from "lzma-native";
import { db, mdtk } from "./db";
import { console } from "inspector";
import { everyStep } from "./util/util";

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
    file = await fs_p.open(filmlistePath);
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
  await fs_p.writeFile(path, Buffer.from(buffer));
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
  const alreadyDownloaded =
    (await firstNUrl(checkFirstBytes)) == (await firstNFile(checkFirstBytes));
  if (!alreadyDownloaded || force) {
    await downloadFilmliste();
    await decompressFilmliste();
    const { id, count } = await insertFilme(parseFilme());
    console.log(`inserted ${count} films with id ${id}`);
  } else {
    console.log("Filmliste is up to date");
  }
  return !alreadyDownloaded;
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

function createFilmsTable(db: any) {
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
const fields =
  // 0    1     2     3     4    5     6  7            8   9
  "sender,thema,titel,datum,zeit,dauer,mb,beschreibung,url,website," +
  //10      11      12    13        14    15        16     17         18  19
  "captions,urlRtmp,urlLD,urlRtmpLD,urlHD,urlRtmpHD,datumL,urlHistory,geo,neu";

export function countFilms() {
  return {
    c: new Map(),
    count(sender: string, thema: string) {
      let s = this.c.get(sender);
      if (!s) {
        s = new Map();
        this.c.set(sender, s);
      }
      s.set(thema, (s.get(thema) || 0) + 1);
    },
  };
}
export function* parseFilme(path = filmlisteJson) {
  let json = fs.readFileSync(path, { encoding: "utf8" });
  if (json.charAt(json.length - 1) != "}") {
    console.warn("Filmlist not ending with } (incomplete?) ");
  }
  json = json.slice(1, -1);
  const [_, liste, felder, ...filme] = json.split(/,?"(?:X|Filmliste)":/);
  // Liste ["07.09.2024, 09:35","07.09.2024, 07:35","3","MSearch [Vers.: 3.1.238]","22ae3b493eb73e562ffdadd00b71a743"]
  const [local_, utc_, nr, version, hash] = JSON.parse(liste);
  yield {
    local: parseDate(local_).toISOString(),
    utc: parseDate(utc_).toISOString(),
    nr,
    version,
    hash,
  };
  const counter = countFilms();
  let mapper = () => {
    let sender = "",
      thema = "";
    return (line: string): any => {
      const vs = JSON.parse(line);
      sender = vs.shift() || sender;
      thema = vs.shift() || thema;
      counter.count(sender, thema);
      vs[6] = Number(vs[6]);
      vs[16] = Number(vs[16]);
      return [sender, thema, ...vs];
    };
  };
  let m = mapper();
  for (let f of filme) {
    yield m(f);
  }
  return counter.c;
}
export async function insertFilme(filme: any, step: number = 5000) {
  const { value: liste } = filme.next();
  console.log(liste);
  db.prepare(
    `INSERT INTO mediathek ( local , utc , nr , version , hash ) VALUES ( @local,@utc,@nr,@version,@hash )`,
  ).run(liste);
  const id = db
    .prepare("SELECT id from mediathek where utc = @utc")
    .pluck()
    .get(liste) as Number;
  const dbMdtk = mdtk(id);
  createFilmsTable(dbMdtk);
  const values = fields.replace(/\w+/g, "?");
  const sql = dbMdtk.prepare(`
    INSERT INTO films (${fields} ) VALUES (${values})`);
  const stepper = everyStep(step);
  let n;
  while (true) {
    n = filme.next();
    if (n.done) break;
    sql.run(n.value);
    stepper.tick();
  }
  return { id, count: stepper.count, counter: n.value };
}
