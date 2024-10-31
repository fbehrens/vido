import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
  uniqueIndex,
  sqliteView,
} from "drizzle-orm/sqlite-core";

export const movies = sqliteTable("movies", {
  id: integer().primaryKey({ autoIncrement: true }),
  filename: text().notNull(),
  duration: real(),
  segments: text(),
  framerate: real(),
});

export const clips = sqliteTable(
  "clips",
  {
    movieId: integer("movie_id").references(() => movies.id, {
      onDelete: "cascade",
    }),
    id: integer(),
    start: real(),
    end: real(),
    text: text(),
    filesize: real(),
    transcript: text(),
    segments: text(),
  },
  (table) => {
    return {
      pk0: primaryKey({
        columns: [table.movieId, table.id],
        name: "clips_movie_id_id_pk",
      }),
    };
  },
);

export const youtube = sqliteTable("youtube", {
  id: text().primaryKey(),
  info: text(),
  lang: text(),
  json3: text(),
});

export const mediathek = sqliteTable("mediathek", {
  id: integer().primaryKey({ autoIncrement: true }),
  local: text(),
  utc: text().unique(),
  nr: text(),
  version: text(),
  hash: text(),
});

export const clipsV = sqliteView("clips_v", {
  movieId: integer("movie_id"),
  id: integer(),
  segments: text(),
  mFilename: text("m_filename"),
}).as(
  sql`select movie_id,c.id,c.segments,m.filename as m_filename from clips as c join movies as m on c.movie_id = m.id`,
);

export const films = sqliteTable("films", {
  id: integer().primaryKey(),
  sender: text(),
  thema: text(),
  titel: text(),
  datum: text(),
  zeit: text(),
  dauer: text(),
  mb: real(),
  beschreibung: text(),
  url: text(),
  website: text(),
  captions: text(),
  urlRtmp: text(),
  urlLd: text(),
  urlRtmpLd: text(),
  urlHd: text(),
  urlRtmpHd: text(),
  datumL: integer(),
  urlHistory: text(),
  geo: text(),
  neu: text(),
});

export const filmsImport = sqliteTable("films_import", {
  id: integer().primaryKey(),
  sender: text(),
  thema: text(),
  titel: text(),
  datum: text(),
  zeit: text(),
  dauer: text(),
  mb: real(),
  beschreibung: text(),
  url: text(),
  website: text(),
  captions: text(),
  urlRtmp: text(),
  urlLd: text(),
  urlRtmpLd: text(),
  urlHd: text(),
  urlRtmpHd: text(),
  datumL: integer(),
  urlHistory: text(),
  geo: text(),
  neu: text(),
});
