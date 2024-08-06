<script lang="ts">
  import type { Segment, Movie } from "$lib/types.js";
  import Segments from "./Segments.svelte";
  import Icon from "$lib/components/Icon.svelte";

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
  let segments: Segment[] = $state(JSON.parse(movie.segments));

  let time = $state(0);
  let start: number = $state(10);
  let length: number = $state(10);
  let end: number = $state(20);
  let paused = $state(true);
  let video: HTMLVideoElement;
</script>

<form>
  <input class="bg-gray-200" readonly name="filename" value={movie.filename} />
  <div>
    <input
      class="w-[4ch]"
      name="start"
      bind:value={start}
      onchange={() => (end = Number(length) + Number(start))}
    />
    s...(
    <input
      class="w-[4ch]"
      name="length"
      bind:value={length}
      onchange={() => (end = Number(length) + Number(start))}
    />

    s)...
    <input
      class="w-[4ch]"
      name="end"
      bind:value={end}
      onchange={() => (length = end - start)}
    />
    s
  </div>
</form>
<div class="grid grid-cols-[30%,1fr]">
  <div class="p-1">
    <!-- svelte-ignore a11y_media_has_caption -->
    <video
      bind:this={video}
      bind:paused
      bind:currentTime={time}
      src={"/" + movie.filename}
      controls
    >
    </video>
  </div>
  <div>
    <p>time={time}</p>
  </div>
</div>

<Segments bind:time {segments}></Segments>

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
