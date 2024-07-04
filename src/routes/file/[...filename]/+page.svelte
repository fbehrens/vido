<script lang="ts">
  export let data;
  import { enhance } from "$app/forms";
  //   import type { CustomEvent } from "svelte/elements";
  //Module '"svelte/elements"' has no exported member 'CustomEvent'.

  import type { ActionResult, SubmitFunction } from "@sveltejs/kit";
  import type { Movie, Segment } from "$lib/types.js";
  import SegmentRow from "./SegmentRow.svelte";
  let result: ActionResult;

  const handleSubmit: SubmitFunction = () => {
    return async ({ result }) => {
      if (result.type === "success") {
        console.log(result.data!.data);
      }
    };
  };
  const handleDelete: SubmitFunction = () => {
    return async ({ result }) => {
      if (result.type === "success") {
        segments = [];
      }
    };
  };
  let { movie, segments } = data;
  segments = segments
    .sort((a, b) => a.start - b.start)
    .map((s, index) => {
      const next: Segment | undefined = segments[index + 1];
      s.dublicate = next && s.end > next.start;
      return s;
    });
  segments = segments
    .sort((a, b) => (a.clip == b.clip ? a.start - b.start : a.clip - b.clip))
    .map((s) => {
      s.start = Number(s.start.toFixed(2));
      s.end = Number(s.end.toFixed(2));
      return s;
    });
  let clip =
    segments.length > 1 ? Math.trunc(segments[segments.length - 2].start) : 0;
  let clip_length = 20;
  $: end = Number(clip) + Number(clip_length);
  function deleteSegment(event: CustomEvent) {
    const d = event.detail;
    console.log({ deleteSegment: d });
    segments = segments.filter((s) => s.clip != d.clip || s.id != d.id);
  }
</script>

<form method="POST" use:enhance={handleSubmit}>
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
      <input class="w-[4ch]" name="clip" bind:value={clip} />
      s - {end}s (length=
      <input class="w-[4ch]" name="clip_length" bind:value={clip_length} />
      s)
      <button
        formaction="?/whisper"
        class="p-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
        >whisper</button
      >
    </div>
  </div>
</form>
<form method="POST" use:enhance={handleDelete}>
  <input hidden name="id" value={movie.id} />
  <button
    formaction="?/delete"
    class=" bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
    >delete transcript</button
  >
</form>

{#each segments as s}
  <SegmentRow
    clip={s.clip}
    id={s.id}
    start={s.start}
    end={s.end}
    text={s.text}
    dublicate={s.dublicate}
    on:delete={deleteSegment}
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
