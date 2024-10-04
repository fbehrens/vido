import Database from "better-sqlite3";
import { ENVIRONMENT } from "$env/static/private";

const dbPath = `db/${ENVIRONMENT}.db`;
export const db = new Database(dbPath);

export function mdtk(id: Number): typeof db {
  const db = new Database(`db/mdtk/${id}.db`);
  return db;
}
