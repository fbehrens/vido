# vod

* Subtitles
    * [Advanced SubStation Alpha](https://www.nikse.dk/subtitleedit/formats/assa)
    * [libass](https://github.com/libass/libass/wiki/ASS-File-Format-Guide)

## Ass

```
[Script Info]
Title: MPV Subtitle Demo
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.601

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default1,Arial,40,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1
Style: BottomLeft,Arial,40,&H00FFFF00,&H000000FF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,1,1,1,30,10,40,1
Style: TopCenter,Arial,40,&H00FF00FF,&H000000FF,&H00000000,&H64000000,0,1,0,0,100,100,0,0,1,2,0,8,10,10,40,1
Style: FloatingBox,Arial,28,&H0000FF00,&H000000FF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,2,2,7,20,20,200,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:14.00,0:00:14.90,Default1,,0,0,0,,This is the Default1 style
Dialogue: 0,0:00:15.00,0:00:15.90,BottomLeft,,0,0,0,,Appears in bottom-left corner
Dialogue: 0,0:00:16.00,0:00:16.90,TopCenter,,0,0,0,,Appears in top-center and italic
Dialogue: 0,0:00:17.00,0:00:17.90,FloatingBox,,0,0,0,,Styled green with shadow\nPositioned floating mid-right
Dialogue: 0,0:00:18.00,0:00:18.90,Default1,,0,0,0,,{\pos(640,360)}Exact positioning at center (640×360)
Dialogue: 0,0:00:19.00,0:00:19.90,Default1,,0,0,0,,{\move(100,600,1000,100)}Moving text from bottom-left to top-right

[Script Info]
Title: MPV Subtitle Effects Demo
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
ScaledBorderAndShadow: yes
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,40,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1
Style: Effects,Arial,40,&H00FFFF00,&H000000FF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1
Style: Karaoke,Arial,40,&H00FFFFFF,&H0000FF00,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,1,1,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text

; Fade in and fade out
Dialogue: 0,0:00:01.00,0:00:05.00,Effects,,0,0,0,,{\fad(1000,1000)}Fades in and out smoothly

; Typewriter effect
Dialogue: 0,0:00:06.00,0:00:10.00,Effects,,0,0,0,,{\k20}T{\k20}y{\k20}p{\k20}e{\k20}w{\k20}r{\k20}i{\k20}t{\k20}e{\k20}r

; Karaoke highlighting (secondary color on syllables)
Dialogue: 0,0:00:11.00,0:00:15.00,Karaoke,,0,0,0,,{\k30}This {\k30}is {\k30}karaoke {\k60}style

; Rotating and scaled text
Dialogue: 0,0:00:16.00,0:00:20.00,Effects,,0,0,0,,{\frz45\fscx150\fscy150}Rotated 45° and scaled 150%

; Position and fade with movement
Dialogue: 0,0:00:21.00,0:00:25.00,Effects,,0,0,0,,{\move(100,700,1000,100)\fad(500,500)}Moving + fade

; Color transform with blur
Dialogue: 0,0:00:26.00,0:00:30.00,Effects,,0,0,0,,{\1c&H0000FF&\3c&HFFFFFF&\blur1}Blue text with white outline and blur

; Transparent background text (subtitle floating)
Dialogue: 0,0:00:31.00,0:00:35.00,Effects,,0,0,0,,{\alpha&HAA&}Semi-transparent text

; Scaling animation
Dialogue: 0,0:00:36.00,0:00:40.00,Effects,,0,0,0,,{\t(0,2000,\fscx200\fscy200)}Text scales up to 200% in 2s

```

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
