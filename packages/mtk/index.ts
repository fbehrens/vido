import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { person } from "./drizzle/schema";

const db = new Database("local.db");

const drz = drizzle({ client: db });

// const row = db.query("SELECT * FROM person;").get();

const row = await drz.select().from(person);
console.log(row);