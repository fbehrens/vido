import { desc, relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, real, primaryKey, index } from "drizzle-orm/sqlite-core";
export const movies = sqliteTable("movies", {
  id: integer().primaryKey({ autoIncrement: true }),
  youtubeId: text(),
  url: text(),
  filename: text(),
  data: text(),
  title: text().notNull(),
  language: text(),
  channel: text(),
  description: text(),
  duration: real().notNull(),
  framerate: real(),
  created_at: text().notNull(),
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
