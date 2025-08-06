# vod

## Subtitles

* [Advanced SubStation Alpha](https://www.nikse.dk/subtitleedit/formats/assa)
* [libass](https://github.com/libass/libass/wiki/ASS-File-Format-Guide)

```bash

General
Complete name                            : /Volumes/T7/serien/Devs Season 1 Mp4 1080p/Devs S01E07.mp4
Format                                   : MPEG-4
Format profile                           : Base Media
Codec ID                                 : isom (isom/iso2/avc1/mp41)
File size                                : 1.41 GiB
Duration                                 : 53 min 39 s
Overall bit rate mode                    : Variable
Overall bit rate                         : 3 749 kb/s
Frame rate                               : 23.976 FPS
Encoded date                             : 2020-04-10 07:04:00 UTC
Tagged date                              : 2020-04-10 07:04:00 UTC
Writing application                      : Lavf58.35.101

Video
ID                                       : 1
Format                                   : AVC
Format/Info                              : Advanced Video Codec
Format profile                           : High@L4.1
Format settings                          : CABAC / 5 Ref Frames
Format settings, CABAC                   : Yes
Format settings, Reference frames        : 5 frames
Codec ID                                 : avc1
Codec ID/Info                            : Advanced Video Coding
Duration                                 : 53 min 39 s
Bit rate mode                            : Variable
Bit rate                                 : 3 359 kb/s
Maximum bit rate                         : 24.0 Mb/s
Width                                    : 1 920 pixels
Height                                   : 960 pixels
Display aspect ratio                     : 2.000
Frame rate mode                          : Constant
Frame rate                               : 23.976 (24000/1001) FPS
Color space                              : YUV
Chroma subsampling                       : 4:2:0
Bit depth                                : 8 bits
Scan type                                : Progressive
Bits/(Pixel*Frame)                       : 0.076
Stream size                              : 1.26 GiB (90%)
Writing library                          : x264 core 158 r2984
Encoding settings                        : cabac=1 / ref=6 / deblock=1:0:0 / analyse=0x3:0x133 / me=umh / subme=8 / psy=1 / psy_rd=1.00:0.00 / mixed_ref=1 / me_range=16 / chroma_me=1 / trellis=0 / 8x8dct=1 / cqm=0 / deadzone=21,11 / fast_pskip=0 / chroma_qp_offset=-2 / threads=30 / lookahead_threads=5 / sliced_threads=0 / nr=0 / decimate=1 / interlaced=0 / bluray_compat=1 / constrained_intra=0 / bframes=3 / b_pyramid=1 / b_adapt=2 / b_bias=0 / direct=3 / weightb=1 / open_gop=0 / weightp=1 / keyint=250 / keyint_min=1 / scenecut=40 / intra_refresh=0 / rc_lookahead=60 / rc=2pass / mbtree=1 / bitrate=3359 / ratetol=1.0 / qcomp=0.60 / qpmin=10 / qpmax=51 / qpstep=4 / cplxblur=20.0 / qblur=0.5 / vbv_maxrate=24000 / vbv_bufsize=24000 / nal_hrd=vbr / filler=0 / ip_ratio=1.40 / aq=1:1.00
Encoded date                             : 2020-04-10 07:04:00 UTC
Tagged date                              : 2020-04-10 07:04:00 UTC
Color range                              : Limited
Color primaries                          : BT.709
Transfer characteristics                 : BT.709
Matrix coefficients                      : BT.709
Codec configuration box                  : avcC

Audio
ID                                       : 2
Format                                   : AC-3
Format/Info                              : Audio Coding 3
Commercial name                          : Dolby Digital
Codec ID                                 : ac-3
Duration                                 : 53 min 39 s
Bit rate mode                            : Constant
Bit rate                                 : 384 kb/s
Channel(s)                               : 6 channels
Channel layout                           : L R C LFE Ls Rs
Sampling rate                            : 48.0 kHz
Frame rate                               : 31.250 FPS (1536 SPF)
Compression mode                         : Lossy
Stream size                              : 147 MiB (10%)
Language                                 : English
Service kind                             : Complete Main
Default                                  : Yes
Alternate group                          : 1
Encoded date                             : 2020-04-10 07:04:00 UTC
Tagged date                              : 2020-04-10 07:04:00 UTC
Dialog Normalization                     : -31 dB
cmixlev                                  : -4.5 dB
surmixlev                                : -6 dB
dialnorm_Average                         : -31 dB
dialnorm_Minimum                         : -31 dB
dialnorm_Maximum                         : -31 dB

Text #1
ID                                       : 3
Format                                   : Timed Text
Muxing mode                              : sbtl
Codec ID                                 : tx3g
Duration                                 : 53 min 31 s
Bit rate mode                            : Variable
Bit rate                                 : 34 b/s
Frame rate                               : 0.297 FPS
Stream size                              : 13.5 KiB (0%)
Language                                 : English
Default                                  : Yes
Forced                                   : No
Alternate group                          : 3
Encoded date                             : 2020-04-10 07:04:00 UTC
Tagged date                              : 2020-04-10 07:04:00 UTC
Count of events                          : 477

Text #2
ID                                       : 4
Format                                   : Timed Text
Muxing mode                              : sbtl
Codec ID                                 : tx3g
Duration                                 : 53 min 34 s
Bit rate mode                            : Variable
Bit rate                                 : 43 b/s
Frame rate                               : 0.374 FPS
Stream size                              : 16.8 KiB (0%)
Language                                 : English
Default                                  : No
Forced                                   : No
Alternate group                          : 3
Encoded date                             : 2020-04-10 07:04:00 UTC
Tagged date                              : 2020-04-10 07:04:00 UTC
Count of events                          : 600




# extract
ffmpeg -i "Devs S01E07.mp4" -map 0:s:0 -map 0:s:1 subtitle_%d.srt
```

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
