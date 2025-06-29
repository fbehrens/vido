
```fish
yt-dlp dQw4w9WgXcQ  --write-info-json --skip-download
cat Rick\ Astley\ -\ Never\ Gonna\ Give\ You\ Up\ \(Official\ Video\)\ \(4K\ Remaster\)\ \[dQw4w9WgXcQ\].info.json | jq '.automatic_captions."en-orig".[] | select(.ext =="json3").url'

cat 'Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster) [dQw4w9WgXcQ].en-orig.json3' | jq -j '.events[].segs[]?.utf8'
```
