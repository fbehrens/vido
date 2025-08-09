import { Effect, Config, Layer } from "effect";
import { person } from "./drizzle/schema";

import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import { SqliteClient } from "@effect/sql-sqlite-bun";

const SqlLive = SqliteClient.layerConfig({
  filename: Config.string("DATABASE_URL"),
});

const DrizzleLive = SqliteDrizzle.layer.pipe(Layer.provide(SqlLive));

export const DatabaseLive = Layer.mergeAll(SqlLive, DrizzleLive);

const program = Effect.gen(function* (_) {
  const db = yield* SqliteDrizzle.SqliteDrizzle;
  const row = yield* db.select().from(person);
  console.log(row);
});

const runnable = Effect.provide(program, DatabaseLive);
Effect.runPromise(runnable).catch(console.error);
