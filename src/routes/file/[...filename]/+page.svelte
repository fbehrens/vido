<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Segment, Clip, Word } from "$lib/types.js";
  import Segments from "./Segments.svelte";
  import Timeline from "./Timeline.svelte";
  import Clips from "./Clips.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import Icon from "$lib/components/Icon.svelte";

  const handleWhisper: SubmitFunction = () => {
    isSubmitting = true;
    return async ({ result }) => {
      if (result.type === "success") {
        ({ clips, segments, words } = result.data!);
      }
      isSubmitting = false;
    };
  };
  const callDeleteSegment = async ({ detail }: CustomEvent<{ id: number }>) => {
    const response = await fetch("/api/deleteSegment", {
      method: "POST",
      body: JSON.stringify(detail),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      segments = segments.filter((s) => s.id != detail.id);
      console.log({ responseJson: await response.json() });
    }
  };

  const handleSetTime = async ({ detail }: CustomEvent<{ time: number }>) => {
    console.log(`setTime ${detail.time}`);
    time = detail.time;
  };

  export let data;
  let { movie, segments, words, clips } = data;
  let time = 0;
  let tabs = ["Timeline", "Segments"];
  let activeTab = tabs[0];
  let isSubmitting: boolean;

  let clip_start =
    segments.length > 1 ? Math.trunc(segments[segments.length - 2].start) : 0;
  let clip_length = 20;
  let end = Number(clip_start) + Number(clip_length);
</script>

<form method="POST" use:enhance={handleWhisper}>
  <button
    on:click={async () => {
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
  <input hidden name="id" value={movie.id} />

  <input class="bg-gray-200" readonly name="filename" value={movie.filename} />
  <div>
    <input class="w-[4ch]" name="clip_start" bind:value={clip_start} />
    s...(
    <input
      class="w-[4ch]"
      name="clip_length"
      bind:value={clip_length}
      on:change={() => (end = Number(clip_length) + Number(clip_start))}
    />
    s)...
    <input
      class="w-[4ch]"
      name="end"
      bind:value={end}
      on:change={() => (clip_length = Number(end) - Number(clip_start))}
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
    on:deleteSegment={callDeleteSegment}
    on:setTime={handleSetTime}
  ></Segments>
{:else if activeTab == "Timeline"}
  <Timeline {segments} {words} duration={movie.duration} {time}></Timeline>
{/if}

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
