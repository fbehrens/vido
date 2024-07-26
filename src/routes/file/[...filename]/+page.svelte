<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Segment, Clip, Word, Movie } from "$lib/types.js";
  import Segments from "./Segments.svelte";
  import Timeline from "./Timeline.svelte";
  import ClipsRow from "./ClipsRow.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import Icon from "$lib/components/Icon.svelte";
  import ClipCo from "./ClipCo.svelte";

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

  const { data } = $props();
  let movie: Movie = data.movie;
  let clips: Clip[] = $state(data.clips);
  let clip_id = $state(1);
  let segments: Segment[] = $state(data.segments);
  let words: Word[] = $state(data.words);

  let time = $state(0);
  let tabs = ["Timeline", "Segments", "Clip"];
  let activeTab = $state(tabs[0]);
  let isSubmitting: boolean = $state(false);

  let start: number = $state(10);
  let length: number = $state(10);
  let end: number = $state(20);
</script>

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
    <video src={"/" + movie.filename} controls bind:currentTime={time}> </video>
  </div>
  <div>
    <p>time={time}</p>
  </div>
</div>

<ClipsRow {clips} duration={movie.duration} bind:start bind:end bind:clip_id />

<div class="flex">
  {#each tabs as t}
    <div class="p-1 border border-black {t == activeTab ? 'bg-green-200' : ''}">
      <button onclick={() => (activeTab = t)}>{t}</button>
    </div>
  {/each}
</div>

{#if activeTab == "Segments"}
  <Segments bind:time {segments} {apiDeleteSegment}></Segments>
{:else if activeTab == "Timeline"}
  <Timeline {segments} {words} duration={movie.duration} bind:time {start} {end}
  ></Timeline>
{:else if activeTab == "Clip"}
  <ClipCo
    {clip_id}
    words={words.filter((w) => w.clip_id == clip_id)}
    segments={segments.filter((s) => s.clip_id == clip_id)}
  />
{/if}

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
