<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Segment, Clip, Word, Movie } from "$lib/types.js";
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
  const apiDeleteSegment = async ({ detail }: CustomEvent<{ id: number }>) => {
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

  //   let { data } = $props();
  //   let data = $props();
  //   console.log(data);
  const { data } = $props();
  let movie: Movie;
  let clips: Clip[] = $state([]);
  let segments: Segment[] = $state([]);
  let words: Word[] = $state([]);
  ({ movie, segments, words, clips } = data);

  let time = $state(0);
  let tabs = ["Timeline", "Segments"];
  let activeTab = $state(tabs[0]);
  let isSubmitting: boolean = $state(false);

  let clip_start = $state(10);
  let clip_length = $state(10);
  let end = $state(20);
</script>

<!-- svelte-ignore non_reactive_update -->
<form method="POST" use:enhance={handleWhisper}>
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
  <input hidden name="id" value={movie.id} />

  <input class="bg-gray-200" readonly name="filename" value={movie.filename} />
  <div>
    <input class="w-[4ch]" name="clip_start" bind:value={clip_start} />
    s...(
    <input class="w-[4ch]" name="clip_length" bind:value={clip_length} />
    <!-- onchange={() => (end = Number(clip_length) + Number(clip_start))} -->

    s)...
    <input class="w-[4ch]" name="end" bind:value={end} />
    <!-- onchange={() => (clip_length = Number(end) - Number(clip_start))} -->
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
    <!-- <video src={"/" + movie.filename} controls bind:currentTime={time}> </video> -->
  </div>
  <div>
    <p>time={time}</p>
  </div>
</div>

<Clips {clips} duration={movie.duration} />

<div class="flex">
  {#each tabs as t}
    <div class="p-1 border border-black {t == activeTab ? 'bg-green-200' : ''}">
      <button onclick={() => (activeTab = t)}>{t}</button>
    </div>
  {/each}
</div>

{#if activeTab == "Segments"}
  <Segments bind:time {segments} {handleSetTime} {apiDeleteSegment}></Segments>
{:else if activeTab == "Timeline"}
  <Timeline {segments} {words} duration={movie.duration} {time}></Timeline>
{/if}

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
