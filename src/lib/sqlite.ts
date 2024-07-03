import type { Movie, Segment, Word } from "$lib/types";
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
export function insertSegment(
  db: Database,
  movie_id: number,
  clip: number,
  s: Segment,
): void {
  s.clip = clip;
  const stmt = db.prepare(`
    INSERT INTO segments (movie_id, clip, id, start, end, text, seek, tokens, temperature, avg_logprob, compression_ratio, no_speech_prob)
    VALUES (@movie_id, @clip, @id, @start+@clip, @end+@clip, @text, @seek, @tokens, @temperature, @avg_logprob, @compression_ratio, @no_speech_prob)
  `);
  stmt.run({
    movie_id,
    ...s,
    tokens: JSON.stringify(s.tokens),
  });
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

export function selectSegments(db: Database, movie_id: number): Segment[] {
  const stmt = db.prepare("SELECT * FROM segments WHERE movie_id = ?");
  return stmt.all(movie_id) as Segment[];
}

export function insertWord(
  db: Database,
  movie_id: number,
  clip: number,
  w: Word,
): void {
  w.clip = clip;
  db.prepare(
    "INSERT INTO words (movie_id, clip, start, end, word) VALUES (?, ?, ?, ?, ?)",
  ).run(movie_id, w.clip, w.start, w.end, w.word);
}

export function selectWords(db: Database, movie_id: number): Word[] {
  return db
    .prepare("SELECT * FROM words WHERE movie_id = ?")
    .all(movie_id) as Word[];
}
