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

