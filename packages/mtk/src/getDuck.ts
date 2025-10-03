import { DuckDBInstance } from "@duckdb/node-api";

// console.log(duckdb.version());
// console.log(duckdb.configurationOptionDescriptions());
// await fs.unlink(path);
export const getDuck = async ({
  path,
  ui = false,
}: {
  path: string;
  ui?: boolean;
}) => {
  console.log({ path });
  const instance = await DuckDBInstance.fromCache(path);
  const con = await instance.connect();
  if (ui) {
    await con.run("CALL start_ui()");
  }
  return con;
};
