import { channel } from "diagnostics_channel";
import { desc, relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core";

export const movies = sqliteTable("movies", {
  id: integer().primaryKey({ autoIncrement: true }),
  filename: text(),
  youtubeId: text(),
  data: text(),
  title: text(),
  language: text(),
  channel: text(),
  description: text(),
  duration: real(),
  framerate: real(),
});

export const captions = sqliteTable("captions", {
  id: integer().primaryKey({ autoIncrement: true }),
  movieId: integer("movie_id")
    .notNull()
    .references(() => movies.id, {
      onDelete: "cascade",
    }),
  typ: text(),
  data: text(), //json
});

//relations
export const moviesRelations = relations(movies, ({ many }) => ({
  captions: many(captions),
}));

export const captionsRelations = relations(captions, ({ one }) => ({
  movie: one(movies, {
    fields: [captions.movieId],
    references: [movies.id],
  }),
}));

// mediathek
export const mediathek = sqliteTable("mediathek", {
  id: integer().primaryKey({ autoIncrement: true }),
  createdAt: integer(),
  local: text(),
  utc: text(),
  nr: text(),
  version: text(),
  hash: text(),
  etag: text(),
});

export const films = sqliteTable(
  "films",
  {
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
  },
  (table) => {
    return {
      nameIdx: index("clips_movie_id_id_pk").on(table.sender, table.thema),
    };
  },
);

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
