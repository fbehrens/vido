import { describe, it, expect } from "vitest";
import { type Movie } from "$lib/types";
import { getMovie, moviesCount } from "$lib/sqlite";
import Database from "better-sqlite3";
import exp from "constants";

const db = new Database("db/test.db");

describe("sqlite", () => {
  it("getMovie", () => {
    db.prepare(`DELETE FROM movies`).run();
    expect(moviesCount(db)).toBe(0);
    let id1 = getMovie(db, { filename: "bambi" });
    expect(moviesCount(db)).toBe(1);
    id1 = getMovie(db, { filename: "bambi" });
    expect(moviesCount(db)).toBe(1);
    const id2 = getMovie(db, { filename: "bambi2" });
    expect(moviesCount(db)).toBe(2);
    expect(id1 !== id2).toBeTruthy();
  });
  it("update Movie", () => {
    expect(moviesCount(db)).toBe(2);
  });
});
