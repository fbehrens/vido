-- 11
alter table clips add column filesize REAL;
-- 12
alter table words add column sep TEXT;
--13
drop VIEW words_v;
CREATE VIEW words_v AS
SELECT
  w.movie_id,
  w.id ,
  w.clip_id ,
  w.segment_id ,
  w.start + c.start "start",
  w.end + c.start "end",
  w.word,
  w.sep
FROM
  words w
JOIN
  clips c ON w.movie_id = c.movie_id AND w.clip_id = c.id;

CREATE TABLE youtube (
  id TEXT PRIMARY KEY ,
  info TEXT
);
--14
alter table youtube add column lang TEXT;
alter table youtube add column json3 TEXT;
--15
alter table movies add column transcript TEXT;
alter table movies drop column transcript ;
alter table clips add column transcript TEXT;
--16
alter table clips add column segments TEXT;
alter table movies add column segments TEXT;
--17
drop view segments_v;
drop table segments;
drop table words;
--18
DROP VIEW clips_v;
CREATE VIEW clips_v AS
select movie_id,c.id,c.segments,m.filename as m_filename from clips as c join movies as m on c.movie_id = m.id;
--19
alter table movies add column framerate REAL;
--20
drop table mediathek;
CREATE TABLE mediathek (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "local" TEXT,
    utc TEXT,
    nr TEXT,
    version TEXT,
    hash TEXT)
CREATE UNIQUE INDEX mediathek_utc ON mediathek(utc);