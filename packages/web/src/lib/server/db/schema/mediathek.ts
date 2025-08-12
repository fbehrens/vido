import { desc, relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, real, primaryKey, index } from "drizzle-orm/sqlite-core";

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
    return [index("clips_movie_id_id_pk").on(table.sender, table.thema)];
  },
);

export const filmsPrev = sqliteTable("films_prev", {
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
