<script lang="ts">
  import SegmentRow from "./SegmentRow.svelte";
  import { getMovie, getOpenai } from "./data.remote";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as S from "effect/Schema";
  import { TypSegmented } from "$lib/schema/captions";
  import { type TypJson } from "$lib/schema/captions";
  import * as Select from "$lib/components/ui/select/index.js";
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

  const allCaptions = movie.captions.map(({ typ }) => typ);
  let currentCaption = $state(allCaptions[0]);
  const selectText = $derived(currentCaption ?? "Select captions");
  const caption = $derived(movie.captions.find(({ typ }) => typ == currentCaption));
  const segments = $derived(caption && S.decodeSync(TypSegmented)(caption as TypJson));

  let currentTime = $state(0);
  let current = $state<number>(0);
  let playbackRate = $state(1);
  let paused = $state(true);
  let video: HTMLVideoElement;
  $effect(() => {
    if (segments) {
      while (segments[current + 1] && currentTime >= segments[current + 1].start) {
        current++;
      }
      while (current > 0 && currentTime < segments[current].start) {
        current--;
      }
    }
  });
  let active = $derived(
    segments && (!segments[current].end || currentTime <= segments[current].end),
  );
</script>

<div class="flex flex-row">
  <Select.Root type="single" name="selectCaption" bind:value={currentCaption}>
    <Select.Trigger class="w-[180px]">
      {selectText}
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        {#each allCaptions as caption}
          <Select.Item value={caption} label={caption}>
            {caption}
          </Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
  </Select.Root>

  <Button
    class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    onclick={async () => {
      try {
        const result = await getOpenai(id);
        alert(result);
      } catch (error) {
        alert("Something went wrong!");
      }
    }}>whisper_api</Button
  >
</div>

<div>
  <input class="w-full bg-gray-200" readonly name="filename" value={movie.filename} />
</div>
<div class="p-1">
  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    bind:this={video}
    bind:paused
    bind:currentTime
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
      <SegmentRow {...s} bind:time={currentTime}></SegmentRow>
    {:else}
      <div><button onclick={() => (currentTime = s.start)}>{s.text}</button></div>
    {/if}
  {/each}
{/if}

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
