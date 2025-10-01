import {
  csv2duck,
  filmeCsv,
  filmeJson,
  parseJson,
  updateFilmliste,
} from "./mediathek";
import * as fs from "fs";

const [_node, _viteNode, ...args] = process.argv;
console.log("loads filmliste (-f)orce) (-p)arseImport");
const has = (arg: string) => args.includes(arg);

if (has("-p")) {
  let buffer = fs.readFileSync(filmeJson);
  console.log(`parse -> ${filmeCsv}`);
  const { info, lines } = parseJson(buffer);
  console.log(`import ${lines.length} rows`);
  fs.writeFileSync(filmeCsv, lines.join("\n"));

  await csv2duck();
} else {
  await updateFilmliste({ force: has("-f") });
}
