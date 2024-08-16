CREATE TABLE movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT UNIQUE NOT NULL
, duration REAL, segments TEXT, framerate REAL);
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE clips (
  movie_id INTEGER,
  id INTEGER,
  start REAL,
  end REAL,
  text TEXT, filesize REAL, transcript TEXT, segments TEXT,
  PRIMARY KEY ( movie_id, id )
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);
CREATE TABLE youtube (
  id TEXT PRIMARY KEY ,
  info TEXT
, lang TEXT, json3 TEXT);
CREATE VIEW clips_v AS
select movie_id,c.id,c.segments,m.filename as m_filename from clips as c join movies as m on c.movie_id = m.id
/* clips_v(movie_id,id,segments,m_filename) */;
