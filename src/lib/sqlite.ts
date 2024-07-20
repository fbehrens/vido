import type { Movie, Segment, Word } from "$lib/types";
import type { Database } from "better-sqlite3";

export function moviesCount(db: Database): number {
  return select<Movie>(db, "movies").length;
}

export function select<T>(db: Database, table: string): T[] {
  const stmt = db.prepare(`SELECT * FROM ${table}`);
  return stmt.all() as T[];
}

export function createMovie(
  db: Database,
  o: { filename: string; duration: number },
): Movie {
  const transaction = db.transaction(() => {
    db.prepare(
      "INSERT OR IGNORE INTO movies (filename,duration) VALUES (@filename,@duration)",
    ).run(o);
    return {
      ...o,
      id: db.prepare("SELECT * FROM movies WHERE filename = @filename").get(o),
    } as Movie;
  });
  return transaction()!;
}

export function updateSegmentText(
  db: Database,
  movie_id: number,
  clip: number,
  id: number,
  newText: string,
): void {
  const stmt = db.prepare(
    "UPDATE segments SET text = ? WHERE movie_id = ? AND clip = ? AND id = ?",
  );
  stmt.run(newText, movie_id, clip, id);
}
export function deleteSegment(
  db: Database,
  movie_id: number,
  clip: number,
  id: number,
): void {
  const stmt = db.prepare(
    "DELETE FROM segments WHERE movie_id = ? AND clip = ? AND id = ?",
  );
  stmt.run(movie_id, clip, id);
}

export function selectSegmentsByClip(
  db: Database,
  movie_id: number,
  clip_id: number,
): Segment[] {
  return db
    .prepare(
      "SELECT clip_id, start, end, text, id FROM segments_v WHERE movie_id = ? AND clip_id = ?",
    )
    .all(movie_id, clip_id) as Segment[];
}

export function selectWords(db: Database, movie_id: number): Word[] {
  return db
    .prepare(
      "SELECT id, clip_id, start, end, word FROM words_v WHERE movie_id = ?",
    )
    .all(movie_id) as Word[];
}
