<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Segment } from "$lib/types.js";
  import SegmentRow from "./SegmentRow.svelte";
  import WordsTable from "$lib/components/WordsTable.svelte";

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
  export let data;
  let { movie, segments, words } = data;
  let isSubmitting: boolean;
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
  refreshSegments();

  let clip =
    segments.length > 1 ? Math.trunc(segments[segments.length - 2].start) : 0;
  let clip_length = 20;
  $: end = Number(clip) + Number(clip_length);
</script>

<form method="POST" use:enhance={handleWhisper}>
  <div class="flex">
    <div class="w-[10ch]">id</div>
    <input
      class=" text-gray-400 bg-gray-200"
      readonly
      name="id"
      value={movie.id}
    />
  </div>
  <div class="flex">
    <div class="w-[10ch]">filename</div>
    <input
      class="text-gray-400 bg-gray-200"
      readonly
      name="filename"
      value={movie.filename}
    />
  </div>
  <div class="flex">
    <div class="w-[10ch]">duration</div>
    <p class="text-gray-400 bg-gray-200">{movie.duration + " s"}</p>
  </div>
  <div class="flex">
    <div class="w-[10ch]"></div>
    <div>
      <input class="w-[4ch]" name="clip_start" bind:value={clip} />
      s - {end}s (length=
      <input class="w-[4ch]" name="clip_length" bind:value={clip_length} />
      s)
      <button
        formaction="?/whisper"
        class="p-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
        >{isSubmitting ? "Submitting..." : "Whisper"}</button
      >
    </div>
  </div>
</form>
<form method="POST" use:enhance={handleDeleteAll}>
  <input hidden name="id" value={movie.id} />
  <button
    formaction="?/delete"
    class=" bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
    >delete transcript</button
  >
</form>
<br />
{#each segments as s}
  <SegmentRow
    words={words.filter((w) => w.start > s.start && w.end <= s.end)}
    clip_id={s.clip_id}
    id={s.id}
    start={s.start}
    end={s.end}
    text={s.text}
    dublicate={s.dublicate}
    on:delete={async (e) => {
      const d = e.detail;
      segments = segments.filter((s) => s.clip_id != d.clip_id || s.id != d.id);
      const response = await fetch("/api/deleteSegment", {
        method: "POST",
        body: JSON.stringify(d),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log({ body: await response.json() });
    }}
  ></SegmentRow>
{/each}

<!-- svelte-ignore a11y-media-has-caption -->
<video src={"/" + movie.filename} controls> </video>

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
