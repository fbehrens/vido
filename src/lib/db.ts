import Database from "better-sqlite3";
import { ENVIRONMENT } from "$env/static/private";

export const db = new Database(`db/${ENVIRONMENT}.db`);
