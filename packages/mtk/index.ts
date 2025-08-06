import { Database } from "bun:sqlite";
const db = new Database(":memory:");
const row = db.query("select 'Hello world' as message;").get(); // => { me

// import Database from "better-sqlite3";
// const l = new Database("local.db");
// const row = l.prepare("SELECT * FROM person").get();
console.log(row);
