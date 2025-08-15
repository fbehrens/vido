import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema2 from "./drizzle2/schema";
import * as schema1 from "./drizzle1/schema";
import "dotenv/config";

console.log(process.env.DATABASE2_URL);

const sqlite2 = new Database(process.env.DATABASE2_URL);
const db = drizzle({ client: sqlite2, schema: schema2 });
const row = await db.select().from(schema2.person);
console.log({ row });

const sqlite1 = new Database(process.env.DATABASE1_URL);
const db1 = drizzle({ client: sqlite1, schema: schema1 });
const row1 = await db1.select().from(schema1.person1);
console.log({ row1 });
