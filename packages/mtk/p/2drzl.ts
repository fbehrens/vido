import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema2 from "./drizzle2/schema";
import * as schema1 from "./drizzle1/schema";

const sqlite3 = new Database(process.env.DATABASE_URL);
const db = drizzle({ client: sqlite3, schema: schema2 });
const row = await db.select().from(schema2.person);
console.log({ row });

const sqlite1 = new Database(process.env.DATABASE1_URL);
const db1 = drizzle({ client: sqlite1, schema: schema1 });
const row1 = await db1.select().from(schema1.person1);
console.log({ row1 });
