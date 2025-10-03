import {
  csv2duck,
  filmeCsv,
  filmeJson,
  insertInfo,
  parseJson,
  updateFilmliste,
} from "./mediathek";
import * as fs from "fs";

const [_node, _viteNode, ...args] = process.argv;
console.log("loads filmliste -(f)orce, -(p)arseImport -(c)svimport");
const has = (arg: string) => args.includes(`-${arg}`);

if (has("p")) {
  let buffer = fs.readFileSync(filmeJson);
  console.log(`parse -> ${filmeCsv}`);
  const { info, lines } = parseJson(buffer);
  await insertInfo({ ...info, etag: "manual" });
  fs.writeFileSync(filmeCsv, lines.join("\n"));
}
if (has("c")) {
  await csv2duck();
}
if (!has("c") && !has("p")) {
  await updateFilmliste({ force: has("f") });
}
