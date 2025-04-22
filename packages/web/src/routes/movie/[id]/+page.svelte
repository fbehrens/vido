<script lang="ts">
  import type { Segment, Movie, Word } from "$lib/types.js";
  import SegmentRow from "./SegmentRow.svelte";
  import Srt from "$lib/components/Srt.svelte";
  import { onMount } from "svelte";
  import { whisperApi } from "$lib/zod-schema";

  const togglePaused = () => {
    if (paused) {
      video.play();
      paused = false; // paused is not binden correcly
    } else {
      video.pause();
      paused = true;
    }
  };
  const { data } = $props();
  let movie = data.movie!;
  const d = movie!.captions[0]!.data!;
  const segments = whisperApi(d);

  const _segments_ = [
    { start: -1, end: 0 },
    ...segments,
    { start: movie.duration, end: movie.duration! + 1 },
  ];
  let time = $state(0);
  let current = $state<number>(0);

  let playbackRate = $state(1);
  let paused = $state(true);
  let video: HTMLVideoElement;
  $effect(() => {
    while (time >= _segments_[current + 1].end) {
      current++;
    }
    while (time < _segments_[current].end) {
      current--;
    }
  });
  onMount(() => {
    let track = video.addTextTrack("captions", "Captions", "en");
    track.mode = "showing";
    segments.forEach((s) => {
      s.words.forEach((w) => {
        track.addCue(new VTTCue(w.start, w.end, w.word + w.sep));
      });
    });
  });
  let active = $derived(time >= segments[current].start);
</script>

<div>
  <input
    class="bg-gray-200 w-full"
    readonly
    name="filename"
    value={movie.filename}
  />
</div>
<Srt id={movie.id} />
<div class="p-1">
  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    bind:this={video}
    bind:paused
    bind:currentTime={time}
    bind:playbackRate
    src={"/" + movie.filename}
    controls
  >
  </video>
</div>
<div>
  <label for="playbackrate">playbackRate:</label>
  <input
    type="range"
    id="playbackRate"
    min="0.1"
    max="2"
    step="0.01"
    bind:value={playbackRate}
  />
  ({playbackRate})
</div>

{#each segments as s, i}
  {#if i == current && active}
    <SegmentRow {...s} bind:time></SegmentRow>
  {:else}
    <div><button onclick={() => (time = s.start)}>{s.text}</button></div>
  {/if}
{/each}

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
