import type { Movie } from "$lib/types";
import type { Database } from "better-sqlite3";

export function moviesCount(db: Database): number {
  return select<Movie>(db, "movies").length;
}

export function select<T>(db: Database, table: string): T[] {
  const stmt = db.prepare(`SELECT * FROM ${table}`);
  return stmt.all() as T[];
}

export function updateMovie(db: Database, m: Movie): void {
  const stmt = db.prepare(`
    UPDATE movies
    SET duration = @duration
    WHERE id = @id
  `);

  stmt.run({
    id: m.id,
    duration: m.duration,
  });
}

export function getMovie(db: Database, { filename }: Movie): Movie {
  const transaction = db.transaction(() => {
    db.prepare("INSERT OR IGNORE INTO movies (filename) VALUES (?)").run(
      filename,
    );
    return db
      .prepare("SELECT * FROM movies WHERE filename = ?")
      .get(filename) as Movie;
  });
  return transaction()!;
}
