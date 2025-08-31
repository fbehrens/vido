<script lang="ts">
  import TextEvent from "$lib/components/TextEvent.svelte";
  import YouTube from "$lib/components/YouTube.svelte";
  import { Json3Json } from "$lib/schema/json3";
  import { YoutubeInfoJson } from "$lib/schema/youtube_info.js";
  import * as S from "effect/Schema";

  let { data } = $props();
  let { movie } = data;
  let time = $state(0);
  let player = $state<YT.Player>();
  if (!movie) throw new Error("Movie not found");

  const ytInfo = S.decodeSync(YoutubeInfoJson)(movie.data!);
  const caption = movie.captions.find((c) => c.typ == "json3");
  const json3 = caption ? S.decodeUnknownSync(Json3Json)(caption.data!) : null;
  const [e1, ...events] = json3 ? json3.events : [];
  const textEvents = events.filter((e) => !e.aAppend && e.segs) as {
    tStartMs: number;
    dDurationMs: number;
    wWinId: number;
    segs: { utf8: string; tOffsetMs?: number }[];
  }[];
  let current = $derived.by(() => {
    const i = textEvents.findIndex((e) => e.tStartMs + 100 > time * 1000);
    return textEvents.slice(i ? i - 1 : i, i + 20);
  });
  const seek = (ms: number): void => player.seekTo(ms / 1000);
  //   assert();
  function assert() {
    const aAppend = events.filter((e) => e.aAppend);
    console.assert(aAppend.every((e) => e.segs?.length == 1));
    console.assert(aAppend.every((e) => e.segs![0].utf8 == "\n"));
    console.assert(aAppend.every((e) => e.wWinId == 1));
    console.assert(
      events.every((e, i) => (!(i % 2) ? e.aAppend === undefined : e.aAppend === 1)),
      "ever odd event is a appendEvent",
    );
  }
  const languagesDisplay = Object.keys(ytInfo.automatic_captions || {}).filter(
    (e) => e.includes("en") || e.includes("de") || e.includes("orig"),
  );
</script>

<div class="grid grid-cols-1 gap-1 lg:grid-cols-2">
  <div>
    @{ytInfo?.channel} <b>/</b>
    {movie!.title}
    <span class="text-xs">
      <br />{ytInfo?.description}
      <br />time:{time}
      <br />language:{ytInfo!.language}
      <br />languags:{languagesDisplay}
    </span>
    <YouTube bind:time bind:player videoId={movie!.youtubeId} />
  </div>

  <div>
    {#if ytInfo!.chapters}
      <h3>Chapters</h3>
      {#each ytInfo!.chapters as chapter}
        <button onclick={() => seek(chapter.start_time * 1000)}>{chapter.title}</button><br />
      {/each}
    {/if}
  </div>
  <div class="h-80 overflow-y-scroll border border-gray-300 p-2">
    {#each textEvents as te}
      <TextEvent {seek} bind:time {...te} />
    {/each}
  </div>
</div>

<!-- {description} -->
