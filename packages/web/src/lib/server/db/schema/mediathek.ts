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
    sender: text().notNull(),
    thema: text().notNull(),
    titel: text().notNull(),
    datum: text().notNull(),
    zeit: text().notNull(),
    dauer: text().notNull(),
    mb: real().notNull(),
    beschreibung: text().notNull(),
    url: text().notNull(),
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
    return [
      index("idx_sender_thema").on(table.sender, table.thema),
      index("idx_datum").on(table.datum),
    ];
  },
);

export const filmsPrev = sqliteTable("films_prev", {
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
