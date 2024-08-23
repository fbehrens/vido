<script lang="ts">
  import type { Segment, Movie, Word } from "$lib/types.js";
  import Icon from "$lib/components/Icon.svelte";
  import SegmentRow from "./SegmentRow.svelte";
  import Srt from "$lib/components/Srt.svelte";
  import { onMount } from "svelte";

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
  let movie: Movie = data.movie;
  const segments: Segment[] = JSON.parse(movie.segments);
  const words: Word[] = segments.flatMap((s) => s.words);
  const _segments_ = [
    { start: -1, end: 0 },
    ...segments,
    { start: movie.duration, end: movie.duration + 1 },
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
    words.forEach((w) => {
      track.addCue(new VTTCue(w.start, w.end, w.word + w.sep));
    });
  });
  let active = $derived(time >= segments[current].start);
</script>

<div class="flex">
  <a href="/api/debug?id={movie.id}">
    <Icon name="debug"></Icon>
  </a>
  <input class="bg-gray-200" readonly name="filename" value={movie.filename} />
</div>
<Srt id={movie.id} />
<div class="grid grid-cols-[30%,1fr]">
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
    <p>time={time}</p>
    <label for="playbackrate">playbackRate({playbackRate})</label>
    <input
      type="range"
      id="playbackRate"
      min="0.1"
      max="2"
      step="0.01"
      bind:value={playbackRate}
    />
  </div>
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
