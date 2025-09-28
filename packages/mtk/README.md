
```bash
# mtk

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

## Duck db

```sql
ls ../../db
duckdb ../../db/duck.db
.table
DROP table filme;

create table filme (
  sender VARCHAR,
  thema VARCHAR,
  titel VARCHAR,
  datum VARCHAR,
  zeit VARCHAR,
  dauer VARCHAR,
  mb VARCHAR,
  beschreibung VARCHAR,
  url VARCHAR,
  website VARCHAR,
  captions VARCHAR,
  urlRtmp VARCHAR,
  urlLD VARCHAR,
  urlRtmpLD VARCHAR,
  urlHD VARCHAR,
  urlRtmpHD VARCHAR,
  datumL VARCHAR,
  urlHistory VARCHAR,
  geo VARCHAR,
  neu VARCHAR,
  );

-- sender,thema,titel,datum,zeit,dauer,mb,beschreibung,url,website,captions,urlRtmp,urlLD,urlRtmpLD,urlHD,urlRtmpHD,datumL,urlHistory,geo,neu



delete from filme;
insert into filme SELECT * FROM read_csv('temp/filmliste.csv')  ;



```
