import { DuckDBInstance } from "@duckdb/node-api";
import { promises as fs } from "fs";
const path = "../../db/duck.db";
// console.log(duckdb.version());
// console.log(duckdb.configurationOptionDescriptions());

await fs.unlink(path);
const instance = await DuckDBInstance.fromCache(path);
export const con = await instance.connect();

await con.run(
  `
  create sequence seq_thema_id;
  create table thema (id INTEGER PRIMARY KEY default nextval('seq_thema_id'),sender VARCHAR,thema VARCHAR)`
);

export const firstRowObject = async (s: string) => {
  const reader = await con.runAndReadAll(s);
  return reader.getRowObjects()[0];
};
