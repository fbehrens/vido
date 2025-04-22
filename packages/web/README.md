# vod

## fyyd

```http
GET https://itunes.apple.com/search?media=podcast&term=wirecutter
```

## mediathek

* [github](https://github.com/mediathekview/mediathekviewweb)

```bash
mv /Users/fb/Library/Caches/MediathekView/filme.json static/mediathek/
wget -O filme.json 'https://liste.mediathekview.de/Filmliste-akt.xz'
```

```javascript
const fs = require('fs');
let path,j,json
path = 'static/mediathek/filme.json'
j = fs.readFileSync(path, 'utf8');
json = JSON.parse(j);
json.X[1]
```

```bash
script/flushdb_from_schema dev
# rm db/dev.db
# sqlite3 db/dev.db < schema.sql


# outpu schema
sqlite3 db/vod.db '.schema' > schema.sql


```

## Icons

* [Reddit](https://www.reddit.com/r/sveltejs/comments/16ic3oh/best_icon_library_for_svelte/)
* [Waytogo](https://github.com/unplugin/unplugin-icons)
* [Gallery](https://icones.js.org/collection/ph)
* [discussion](https://www.reddit.com/r/sveltejs/comments/10rvng1/comment/j6y7bmz/)

## ffmpeg

```bash
# join videos



```

## yt-dlp
