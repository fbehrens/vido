# mtk

```bash

bun install
bun run index.ts

bun add drizzle-orm
bun add -D drizzle-kit



bun run drizzle-kit pull --help
npx drizzle-kit pull --url local.db --dialect sqlite



sqlite3 db.local .schema
npx drizzle-kit push

# create view
npx drizzle-kit pull --url local.db --dialect sqlite --out dtemp


bun add effect @effect/sql-drizzle @effect/sql-sqlite-bun


bun add @effect/experimental
```

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
