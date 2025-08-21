<script lang="ts">
  import SegmentRow from "./SegmentRow.svelte";
  import Srt from "$lib/components/Srt.svelte";
  import { getMovie, getOpenai } from "./data.remote";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as S from "effect/Schema";
  import { WhisperApiSegmented } from "$lib/schema";

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
  const id = data.id;
  let movie = await getMovie(id);
  const cap = movie.captions.find(({ typ }) => typ == "WhisperApi");
  const segments = cap ? S.decodeSync(WhisperApiSegmented)(cap!.data) : undefined;
  const _segments_ = segments
    ? [{ start: -1, end: 0 }, ...segments, { start: movie.duration, end: movie.duration! + 1 }]
    : undefined;
  let time = $state(0);
  let current = $state<number>(0);
  let playbackRate = $state(1);
  let paused = $state(true);
  let video: HTMLVideoElement;
  $effect(() => {
    if (_segments_) {
      while (time >= _segments_[current + 1].end) {
        current++;
      }
      while (time < _segments_[current].end) {
        current--;
      }
    }
  });
  console.log({ movie });
  if (segments) console.log(segments[0]);

  let active = $derived(segments && time >= segments[current].start);
</script>

<div>
  <Button
    class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    onclick={async () => {
      try {
        const result = await getOpenai(id);
        alert(result);
      } catch (error) {
        alert("Something went wrong!");
      }
    }}>transcribe</Button
  >
</div>

<div>
  <input class="w-full bg-gray-200" readonly name="filename" value={movie.filename} />
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
  <input type="range" id="playbackRate" min="0.1" max="2" step="0.01" bind:value={playbackRate} />
  ({playbackRate})
</div>
{#if segments}
  {#each segments as s, i}
    {#if i == current && active}
      <SegmentRow {...s} bind:time></SegmentRow>
    {:else}
      <div><button onclick={() => (time = s.start)}>{s.text}</button></div>
    {/if}
  {/each}
{/if}

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
