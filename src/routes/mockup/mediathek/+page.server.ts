import * as fs from "fs";
export function load({ params, cookies }) {
  let path, filme;
  path = "static/mediathek/filme.json";
  filme = fs.readFileSync(path, "utf8");
  filme = filme.slice(0, -1);
  filme = filme.split(`,"X":`);
  filme.shift();
  filme = filme.map((e) => JSON.parse(e));
  filme = filme.map([]);
  filme = filme.filter((e) => e[2].includes("Markus Lanz vom"));
  console.log(filme);
  return { filme };
}
