<script lang="ts">
  import type { Segment, Movie } from "$lib/types.js";
  import Icon from "$lib/components/Icon.svelte";
  import SegmentRow from "./SegmentRow.svelte";
  import Srt from "$lib/components/Srt.svelte";

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
  let segments: Segment[] = JSON.parse(movie.segments);
  let time = $state(0);
  let currentSegments = $derived(
    segments.filter((s) => s.start > time - 10 && s.end < time + 20),
  );
  let playbackRate = $state(1);
  let paused = $state(true);
  let video: HTMLVideoElement;
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
{#each currentSegments as s}
  <SegmentRow {...s} bind:time></SegmentRow>
{/each}

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
