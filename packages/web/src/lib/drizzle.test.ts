import { describe, test, expect } from "vitest";
import { eq, lt, gte, ne, sql, desc } from "drizzle-orm";
import { db_mediathek } from "./server/db/mediathek";
import { mediathek } from "./server/db/schema/mediathek";

describe("drizzle", () => {
  test("where", async () => {
    const r = await db_mediathek.select().from(mediathek).orderBy(desc(mediathek.id)).get();
  });
});
