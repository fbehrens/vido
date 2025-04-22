import { describe, test, expect } from "vitest";
import { eq, lt, gte, ne, sql, desc } from "drizzle-orm";
import { db } from "./server/db";
import { captions, mediathek, movies } from "./server/db/schema";

describe("drizzle", () => {

  test("where", async () => {
    const { etag: oldEtag } = await db
      .select()
      .from(mediathek)
      .orderBy(desc(mediathek.id))
      .get()!;
    console.log({ oldEtag });
  });
});
