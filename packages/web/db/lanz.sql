-- sqlite3 dev.db < lanz.sql
.mode line
select * from films_import where thema like 'markus lanz' order by datuml desc limit 1;
