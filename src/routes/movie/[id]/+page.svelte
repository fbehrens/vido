<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Segment, Clip, Word, Movie } from "$lib/types.js";
  import Segments from "./Segments.svelte";
  import Timeline from "./Timeline.svelte";
  import ClipsRow from "./ClipsRow.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import Icon from "$lib/components/Icon.svelte";
  import ClipOne from "./ClipOne.svelte";
  import ClipTwo from "./ClipTwo.svelte";

  const handleWhisper: SubmitFunction = () => {
    isSubmitting = true;
    return async ({ result }) => {
      if (result.type === "success") {
        ({ clips, segments, words } = result.data!);
      }
      isSubmitting = false;
    };
  };
  const apiDeleteSegment = async (o: { id: number }) => {
    const response = await fetch("/api/deleteSegment", {
      method: "POST",
      body: JSON.stringify(o),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      segments = segments.filter((s) => s.id != o.id);
      console.log({ responseJson: await response.json() });
    }
  };
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
  let clips: Clip[] = $state(data.clips);
  let clip_ids = $state([1]);
  let segments: Segment[] = $state(data.segments);
  let words: Word[] = $state(data.words);

  let time = $state(0);
  let tabs = ["Timeline", "Segments", "Clip"];
  let activeTab = $state(tabs[1]);
  let isSubmitting: boolean = $state(false);

  let start: number = $state(10);
  let length: number = $state(10);
  let end: number = $state(20);
  let paused = $state(true);
  let video: HTMLVideoElement;
</script>

<button
  onclick={async () => {
    const response = await fetch("/api/deleteMovie", {
      method: "POST",
      body: JSON.stringify({ id: movie.id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      [clips, segments, words] = [[], [], []];
      console.log({ responseDeleteMovie: await response.json() });
    }
  }}><Icon name="delete" /></button
>

<form method="POST" use:enhance={handleWhisper}>
  <input hidden name="id" value={movie.id} />

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
    <button
      formaction="?/whisper"
      class="p-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
      >{isSubmitting ? "Submitting..." : "Whisper"}</button
    >
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

<ClipsRow
  {clips}
  duration={movie.duration}
  bind:start
  bind:length
  bind:end
  bind:clip_ids
/>

<div class="flex">
  {#each tabs as t}
    <div class="p-1 border border-black {t == activeTab ? 'bg-green-200' : ''}">
      <button onclick={() => (activeTab = t)}>{t}</button>
    </div>
  {/each}
</div>

{#if activeTab == "Segments"}
  <Segments
    bind:time
    segments={segments.filter((s) => clip_ids.includes(s.clip_id))}
    {apiDeleteSegment}
  ></Segments>
{:else if activeTab == "Timeline"}
  <Timeline bind:segments bind:words bind:time {start} {end} {togglePaused}
  ></Timeline>
{:else if activeTab == "Clip"}
  {#if clip_ids.length == 1}
    <ClipOne
      clip_id={clip_ids[0]}
      words={words.filter((w) => w.clip_id == clip_ids[0])}
      segments={segments.filter((s) => s.clip_id == clip_ids[0])}
    />
  {:else}
    <ClipTwo {clip_ids} {start} {end} bind:words />
  {/if}
{/if}

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
