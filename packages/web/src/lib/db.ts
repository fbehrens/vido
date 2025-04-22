import Database from "better-sqlite3";
import { ENVIRONMENT } from "$env/static/private";

export const dbPath = `db/${ENVIRONMENT}.db`,
  dbOld = new Database(dbPath);
