import Database from "better-sqlite3";
import { ENVIRONMENT } from "$env/static/private";

const dbPath = `db/${ENVIRONMENT}.db`;
export const db = new Database(dbPath);
