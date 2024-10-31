import { relations } from "drizzle-orm/relations";
import { movies, clips } from "./schema";

export const clipsRelations = relations(clips, ({one}) => ({
	movie: one(movies, {
		fields: [clips.movieId],
		references: [movies.id]
	}),
}));

export const moviesRelations = relations(movies, ({many}) => ({
	clips: many(clips),
}));