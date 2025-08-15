import { Effect, Config, Layer } from "effect";
import * as schema from "./drizzle2/schema";
import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import { SqliteClient } from "@effect/sql-sqlite-node";
import { Reactivity } from "@effect/experimental";
import "dotenv/config";

const Client = SqliteClient.layerConfig({
  filename: Config.string("DATABASE2_URL"),
});
const DrizzleLive = SqliteDrizzle.layer.pipe(Layer.provide(Client));

class Client1 extends Effect.Service<Client1>()("Client1Tag", {
  scoped: Effect.gen(function* () {
    const filename = yield* Config.string("DATABASE1_URL");
    return yield* SqliteClient.make({ filename });
  }),
}) {}

const program1 = Effect.gen(function* () {
  const db1 = yield* Client1;
  yield* db1`SELECT * FROM person1`;
});

const Live = Layer.mergeAll(
  DrizzleLive,
  Client1.Default.pipe(Layer.provide(Reactivity.layer))
);

const program = Effect.gen(function* () {
  const db = yield* SqliteDrizzle.SqliteDrizzle;
  const row = yield* db.select().from(schema.person);
  const db1 = yield* Client1;
  const row1 = yield* db1`SELECT * FROM person1`;
  console.log({ row, row1 });
});

const runnable = program.pipe(Effect.provide(Live));
Effect.runPromise(runnable).catch(console.error);
