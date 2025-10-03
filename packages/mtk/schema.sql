sql
"CREATE TABLE filme(id INTEGER PRIMARY KEY, sender VARCHAR, thema VARCHAR, titel VARCHAR, datumzeit TIMESTAMP, dauer VARCHAR, mb INTEGER, beschreibung VARCHAR, url VARCHAR, website VARCHAR, captions VARCHAR, urlRtmp VARCHAR, urlLD VARCHAR, urlHD VARCHAR, datumL BIGINT, urlHistory VARCHAR, geo VARCHAR);"
"CREATE TABLE filme_1(id INTEGER, sender VARCHAR, thema VARCHAR, titel VARCHAR, datumzeit TIMESTAMP, dauer VARCHAR, mb INTEGER, beschreibung VARCHAR, url VARCHAR, website VARCHAR, captions VARCHAR, urlRtmp VARCHAR, urlLD VARCHAR, urlHD VARCHAR, datumL BIGINT, urlHistory VARCHAR, geo VARCHAR);"
"CREATE TABLE ""import""(createdAt TIMESTAMP, ""local"" TIMESTAMP, utc TIMESTAMP, nr VARCHAR, ""version"" VARCHAR, hash VARCHAR, etag VARCHAR, id INTEGER DEFAULT(nextval('import_sequence')) PRIMARY KEY);"
"CREATE VIEW thema AS SELECT sender, thema, count_star() AS count FROM filme GROUP BY sender, thema;"
CREATE SEQUENCE import_sequence INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 17 NO CYCLE;
