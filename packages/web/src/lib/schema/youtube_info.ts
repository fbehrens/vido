import * as S from "effect/Schema";

export const AutomaticCaptionExt = S.Literal("json3", "srt", "srv1", "srv2", "srv3", "ttml", "vtt");

export const AudioExtEnum = S.Literal("m4a", "mhtml", "mp4", "none", "webm", "mkv");

export class Format extends S.Class<Format>("Format")({
  format_id: S.String,
  format_note: S.optional(S.NullOr(S.String)),
  ext: S.String,
  acodec: S.optional(S.String),
  vcodec: S.String,
  url: S.String,
  width: S.optional(S.NullOr(S.Number)),
  height: S.optional(S.NullOr(S.Number)),
  fps: S.optional(S.NullOr(S.Number)),
  rows: S.optional(S.NullOr(S.Number)),
  columns: S.optional(S.NullOr(S.Number)),
  //   fragments: S.optional(S.NullOr(S.Array(Fragment))),
  audio_ext: AudioExtEnum,
  video_ext: AudioExtEnum,
  vbr: S.NullOr(S.Number),
  abr: S.NullOr(S.Number),
  tbr: S.NullOr(S.Number),
  resolution: S.String,
  aspect_ratio: S.NullOr(S.Number),
  filesize_approx: S.optional(S.NullOr(S.Number)),
  format: S.String,
  format_index: S.optional(S.Null),
  manifest_url: S.optional(S.NullOr(S.String)),
  //  language: S.optional(S.NullOr(Language)),
  preference: S.optional(S.Null),
  quality: S.optional(S.NullOr(S.Number)),
  has_drm: S.optional(S.NullOr(S.Boolean)),
  source_preference: S.optional(S.NullOr(S.Number)),
  __needs_testing: S.optional(S.NullOr(S.Boolean)),
  asr: S.optional(S.NullOr(S.Number)),
  filesize: S.optional(S.NullOr(S.Number)),
  audio_channels: S.optional(S.NullOr(S.Number)),
  language_preference: S.optional(S.NullOr(S.Number)),
  //   dynamic_range: S.optional(S.NullOr(DynamicRange)),
  //   container: S.optional(S.NullOr(Container)),
  //   downloader_options: S.optional(S.NullOr(DownloaderOptions)),
}) {}

export class Chapter extends S.Class<Chapter>("Chapter")({
  start_time: S.Number,
  title: S.String,
  end_time: S.Number,
}) {}

export class AutomaticCaption extends S.Class<AutomaticCaption>("AutomaticCaption")({
  ext: AutomaticCaptionExt,
  url: S.String,
  name: S.optional(S.String),
  //   impersonate: S.Boolean,
  //   __yt_dlp_client: YtDlpClient,
}) {}

export class YoutubeInfo extends S.Class<YoutubeInfo>("YoutubeInfo")({
  id: S.String,
  title: S.String,
  formats: S.Array(Format),
  //   thumbnails: S.Array(Thumbnail),
  thumbnail: S.String,
  description: S.String,
  channel_id: S.String,
  channel_url: S.String,
  duration: S.Number,
  view_count: S.Number,
  average_rating: S.Null,
  age_limit: S.Number,
  webpage_url: S.String,
  categories: S.Array(S.String),
  tags: S.Array(S.Any),
  playable_in_embed: S.Boolean,
  live_status: S.String,
  media_type: S.String,
  release_timestamp: S.Null,
  _format_sort_fields: S.Array(S.String),
  automatic_captions: S.Record({ key: S.String, value: S.Array(AutomaticCaption) }),
  //   subtitles: Subtitles,
  comment_count: S.Number,
  chapters: S.NullOr(S.Array(Chapter)),
  //   heatmap: S.Null,
  like_count: S.Number,
  channel: S.String,
  channel_follower_count: S.Number,
  uploader: S.String,
  uploader_id: S.String,
  uploader_url: S.String,
  upload_date: S.String,
  timestamp: S.Number,
  availability: S.String,
  original_url: S.String,
  webpage_url_basename: S.String,
  webpage_url_domain: S.String,
  extractor: S.String,
  extractor_key: S.String,
  playlist: S.Null,
  playlist_index: S.Null,
  display_id: S.String,
  fulltitle: S.String,
  duration_string: S.String,
  release_year: S.Null,
  is_live: S.Boolean,
  was_live: S.Boolean,
  requested_subtitles: S.Null,
  _has_drm: S.Null,
  epoch: S.Number,
  requested_formats: S.Array(Format),
  format: S.String,
  format_id: S.String,
  ext: AudioExtEnum,
  protocol: S.String,
  language: S.String,
  format_note: S.String,
  filesize_approx: S.Number,
  tbr: S.Number,
  width: S.Number,
  height: S.Number,
  resolution: S.String,
  fps: S.Number,
  //   dynamic_range: DynamicRange,
  vcodec: S.String,
  vbr: S.Number,
  stretched_ratio: S.Null,
  aspect_ratio: S.Number,
  // acodec: Acodec,
  abr: S.Number,
  asr: S.Number,
  audio_channels: S.Number,
  _filename: S.String,
  filename: S.String,
  _type: S.String,
  //   _version: Version,
}) {}

export const YoutubeInfoJson = S.parseJson(YoutubeInfo);

export function get_json3_url(info: YoutubeInfo, lang?: string) {
  const automatic_captions = info.automatic_captions;
  const available_langs = Object.keys(automatic_captions);
  const orig = available_langs.find((s) => s.endsWith("-orig"));
  const selected_lang =
    [lang, orig, "de", "en"].find((l): l is string => l !== undefined && l in automatic_captions) ??
    available_langs[0];
  const captions = automatic_captions[selected_lang];
  const exts = captions.map((c) => c.ext);
  //   console.log({ available_langs, selected_lang, exts });
  const json3 = captions.find((c) => c.ext === "json3");
  if (json3) {
    return json3.url;
  }
}
