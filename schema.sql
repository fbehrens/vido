CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT UNIQUE NOT NULL,
    duration REAL,
);

CREATE TABLE IF NOT EXISTS segments (
  id INTEGER PRIMARY KEY,
  movie_id INTEGER,
  clip INTEGER,
  start REAL,
  end REAL,
  text TEXT,
  seek REAL,
  tokens TEXT,
  temperature REAL,
  avg_logprob REAL,
  compression_ratio REAL,
  no_speech_prob REAL
);

CREATE TABLE IF NOT EXISTS words (
  movie_id INTEGER,
  clip INTEGER,
  start REAL,
  end REAL,
  word TEXT
);

/*
read -r -d '' SQL << EOV
DROP table words;
CREATE TABLE IF NOT EXISTS words (
  movie_id INTEGER,
  clip INTEGER,
  start REAL,
  end REAL,
  word TEXT
);
EOV


sqlite3 db/test.db $SQL
sqlite3 db/vod.db $SQL

sqlite3 db/test.db .schema
*/

