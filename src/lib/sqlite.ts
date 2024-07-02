import type { Movie } from "$lib/types";
import type { Database } from "better-sqlite3";

export function moviesCount(db: Database): number {
  return select<Movie>(db, "movies").length;
}

export function select<T>(db: Database, table: string): T[] {
  const stmt = db.prepare(`SELECT * FROM ${table}`);
  return stmt.all() as T[];
}

export function createMovie(db: Database, filename: string): number {
  const transaction = db.transaction(() => {
    db.prepare("INSERT OR IGNORE INTO movies (filename) VALUES (?)").run(
      filename,
    );
    const row = db
      .prepare("SELECT * FROM movies WHERE filename = ?")
      .get(filename) as Movie;
    return row.id;
  });
  return transaction();
}
