import {
  makeVector,
  vectorFromArray,
  Dictionary,
  Uint8,
  Utf8,
  tableFromArrays,
  tableToIPC,
} from "@apache-arrow/ts";
import { writeFileSync } from "fs";


type Film = {
  sender: Utf8;
  thema: Utf8;
  titel: Utf8;
  datum: Utf8;
  zeit: Utf8;
  dauer: Utf8;
  mb: Utf8;
  beschreibung: Utf8;
  url: Utf8;
  website: Utf8;
  captions: Utf8;
  urlRtmp: Utf8;
  urlLD: Utf8;
  urlRtmpLD: Utf8;
  urlHD: Utf8;
  urlRtmpHD: Utf8;
  datumL: Utf8;
  urlHistory: Utf8;
  geo: Utf8;
  neu: Utf8;
};

export function toArrow(filme) {
  const f = filme[0];
  let r = {};
  for (const k of Object.keys(f)) {
    r[k] = filme.map((f) => f[k]);
  }
  // const table = tableFromJSON(filme)
  const table = tableFromArrays(r);
  const ipc = tableToIPC<Film>(table, "file");
  writeFileSync("static/mediathek/filme.arrow", ipc);
  // console.log(table.slice(10,13).getChildAt(14)?.toArray())
  console.log(table.schema.fields);
  // return table
}

const utf8Vector = vectorFromArray(["foo", "bar", "baz"], new Utf8());

const dictionaryVector1 = vectorFromArray(["foo", "bar", "baz", "foo", "bar"]);

export const dictionaryVector2 = makeVector({
  data: [0, 1, 2, 0, 1], // indexes into the dictionary
  dictionary: utf8Vector,
  type: new Dictionary(new Utf8(), new Uint8()),
});
