CREATE TABLE movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT UNIQUE NOT NULL
, duration REAL);
-- CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE segments (
  movie_id INTEGER,
  clip_id INTEGER,
  id INTEGER,
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
CREATE TABLE words (
  movie_id INTEGER,
  clip_id INTEGER,
  start REAL,
  end REAL,
  word TEXT
);
CREATE TABLE clips (
  movie_id INTEGER,
  id INTEGER,
  start REAL,
  end REAL
);
