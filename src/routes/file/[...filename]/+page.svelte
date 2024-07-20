<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Segment } from "$lib/types.js";
  import Segments from "./Segments.svelte";
  import Timeline from "./Timeline.svelte";
  import Clips from "./Clips.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";

  const handleWhisper: SubmitFunction = () => {
    isSubmitting = true;
    return async ({ result }) => {
      if (result.type === "success") {
        const s = result.data!.segments as Segment[];
        segments = [...segments, ...s];
        refreshSegments();
      }
      isSubmitting = false;
    };
  };
  const handleDeleteAll: SubmitFunction = () => {
    return async ({ result }) => {
      if (result.type === "success") {
        segments = [];
      }
    };
  };
  const handleDelete = async ({ detail }: CustomEvent<{ id: number }>) => {
    segments = segments.filter((s) => s.id != detail.id);
    const response = await fetch("/api/deleteSegment", {
      method: "POST",
      body: JSON.stringify(detail),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log({ body: await response.json() });
  };

  const handleSetTime = async ({ detail }: CustomEvent<{ time: number }>) => {
    console.log(`setTime ${detail.time}`);
    time = detail.time;
  };

  const refreshSegments = () => {
    segments = segments
      .sort((a, b) => a.start - b.start)
      .map((s, index) => {
        const next: Segment | undefined = segments[index + 1];
        s.dublicate = next && s.end > next.start;
        return s;
      });
    segments = segments.sort((a, b) =>
      a.clip_id == b.clip_id ? a.start - b.start : a.clip_id - b.clip_id,
    );
  };

  export let data;
  let { movie, segments, words, clips } = data;
  let time = 0;
  let tabs = ["Timeline", "Segments"];
  let activeTab = tabs[0];
  let isSubmitting: boolean;

  refreshSegments();

  let clip_start =
    segments.length > 1 ? Math.trunc(segments[segments.length - 2].start) : 0;
  let clip_length = 20;
  $: end = Number(clip_start) + Number(clip_length);
</script>

<form method="POST" use:enhance={handleWhisper}>
  <input hidden name="id" value={movie.id} />
  <input class="bg-gray-200" readonly name="filename" value={movie.filename} />
  <div>
    <input class="w-[4ch]" name="clip_start" bind:value={clip_start} />
    s - {end}s (length=
    <input class="w-[4ch]" name="clip_length" bind:value={clip_length} />
    s)
    <button
      formaction="?/whisper"
      class="p-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
      >{isSubmitting ? "Submitting..." : "Whisper"}</button
    >
  </div>
</form>
<form method="POST" use:enhance={handleDeleteAll}>
  <input hidden name="id" value={movie.id} />
  <button
    formaction="?/delete"
    class=" bg-blue-200 text-white rounded-lg shadow-md hover:bg-blue-400 focus:outlinenone focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
    >delete transcript</button
  >
</form>
<div class="grid grid-cols-[30%,1fr]">
  <div class="p-1">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video src={"/" + movie.filename} controls bind:currentTime={time}> </video>
  </div>
  <div>
    <p>time={time}</p>
  </div>
</div>

<Clips {clips} duration={movie.duration} />

<div class="flex">
  {#each tabs as t}
    <div class="p-1 border border-black {t == activeTab ? 'bg-green-200' : ''}">
      <button on:click={() => (activeTab = t)}>{t}</button>
    </div>
  {/each}
</div>

{#if activeTab == "Segments"}
  <Segments
    bind:time
    {segments}
    on:delete={handleDelete}
    on:setTime={handleSetTime}
  ></Segments>
{:else if activeTab == "Timeline"}
  <Timeline {segments} {words} duration={movie.duration} bind:time></Timeline>
{/if}

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
