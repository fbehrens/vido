import { DuckDBInstance } from "@duckdb/node-api";
export const path = "../../db/duck.db";

// console.log(duckdb.version());
// console.log(duckdb.configurationOptionDescriptions());
// await fs.unlink(path);
export const getDuck = async () => {
  const instance = await DuckDBInstance.fromCache(path);
  return await instance.connect();
};
