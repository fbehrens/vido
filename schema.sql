CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT UNIQUE NOT NULL,
    duration REAL,
);

/*
read -r -d '' SQL << EOV
EOV


sqlite3 db/test.db $SQL
sqlite3 db/vod.db $SQL

sqlite3 db/test.db .schema
*/

