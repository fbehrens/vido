import { describe, test, expect } from "vitest";
import { eq, lt, gte, ne, sql } from "drizzle-orm";
import { db } from "./server/db";
import { movies } from "./server/db/schema";
describe("drizzle", () => {
  test("where", async () => {
    const m = await db.select().from(movies).where(eq(movies.id, 372)).get()!;
    expect(m.filename).toBe("mov/sword.mp4");
  });
  test("findFirst", async () => {
    const c = await db.query.movies.findFirst({
      where: (movies, { eq }) => eq(movies.id, 372),
      columns: {
        id: true,
        filename: true,
        duration: true,
      },
      extras: {
        create: sql<boolean>`CASE WHEN segments IS NULL THEN 1 ELSE 0 END`.as(
          "create",
        ),
      },
      with: {
        clips: {
          columns: {
            id: true,
          },
        },
      },
    });
  });
});
