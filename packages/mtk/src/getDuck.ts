import { DuckDBInstance } from "@duckdb/node-api";
const path = "../../db/duck.db";

// console.log(duckdb.version());
// console.log(duckdb.configurationOptionDescriptions());
// await fs.unlink(path);
export const getDuck = async ({ ui = false }: { ui?: boolean }) => {
  const instance = await DuckDBInstance.fromCache(path);
  const con = await instance.connect();
  if (ui) {
    await con.run("CALL start_ui()");
  }
  return con;
};
