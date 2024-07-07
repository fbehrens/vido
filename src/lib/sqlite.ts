import type { Movie, Segment, WordDb, Word } from "$lib/types";
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

export function selectSegments(
  db: Database,
  movie_id: number,
  clip_id?: number,
): Segment[] {
  let sql =
    "SELECT clip_id, start, end, text, id,  seek, tokens, temperature, avg_logprob, compression_ratio, no_speech_prob FROM segments_v WHERE movie_id = ?";
  if (clip_id) sql += ` AND clip_id=${clip_id}`;
  return db.prepare(sql).all(movie_id) as Segment[];
}

export function selectWords(db: Database, movie_id: number): WordDb[] {
  return db
    .prepare(
      "SELECT id, clip_id, start, end, word FROM words_v WHERE movie_id = ?",
    )
    .all(movie_id) as WordDb[];
}
