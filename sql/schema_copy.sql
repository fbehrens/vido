CREATE TABLE movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT UNIQUE NOT NULL,
    duration REAL);

-- drop table clips;
CREATE TABLE clips (
  movie_id INTEGER,
  id INTEGER,
  start REAL,
  end REAL,
  text TEXT,
  PRIMARY KEY ( movie_id, id )
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- CREATE TABLE sqlite_sequence(name,seq);
-- drop table segments;
CREATE TABLE segments (
  movie_id INTEGER,
  clip_id INTEGER,
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start REAL,
  end REAL,
  text TEXT,
  seek REAL,
  tokens TEXT,
  temperature REAL,
  avg_logprob REAL,
  compression_ratio REAL,
  no_speech_prob REAL,
--   PRIMARY KEY ( movie_id, clip_id, id )
  FOREIGN KEY (movie_id, clip_id) REFERENCES clips(movie_id, id)
);

-- drop table words;
CREATE TABLE words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER,
  clip_id INTEGER,
  start REAL,
  end REAL,
  word TEXT,
  FOREIGN KEY (movie_id, clip_id) REFERENCES clips(movie_id, id)
);

DROP view segments_v;
CREATE VIEW segments_v AS
SELECT
  s.movie_id ,
  s.clip_id ,
  s.id ,
  s.start + c.start "start",
  s.end + c.start "end",
  s.text ,
  s.seek ,
  s.tokens ,
  s.temperature ,
  s.avg_logprob ,
  s.compression_ratio ,
  s.no_speech_prob
FROM
  segments s
JOIN
  clips c ON s.movie_id = c.movie_id AND s.clip_id = c.id;

-- drop view if exists words_v;
CREATE VIEW words_v AS
SELECT
  w.movie_id,
  w.id ,
  w.clip_id ,
  w.start + c.start "start",
  w.end + c.start "end",
  w.word
FROM
  words w
JOIN
  clips c ON w.movie_id = c.movie_id AND w.clip_id = c.id;
