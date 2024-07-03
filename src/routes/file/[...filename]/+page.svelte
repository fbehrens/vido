<script lang="ts">
  export let data;
  import { enhance } from "$app/forms";
  import type { ActionResult, SubmitFunction } from "@sveltejs/kit";
  import type { Movie } from "$lib/types.js";

  let result: ActionResult;

  const handleSubmit: SubmitFunction = () => {
    return async ({ result }) => {
      if (result.type === "success") {
        console.log(result.data!.data);
      }
    };
  };
  let { movie, segments } = data;
  segments = segments.map((s) => {
    s.start = Number(s.start.toFixed(2));
    s.end = Number(s.end.toFixed(2));
    return s;
  });
</script>

<form method="POST" use:enhance={handleSubmit}>
  <div class="flex">
    <div>
      id:<br />
      filename:<br />
      duration [s]:<br />
      start [s]:<br />
    </div>
    <div class="px-2">
      <input
        class="text-gray-400 bg-gray-200"
        readonly
        name="id"
        value={movie.id}
      /><br />
      <input
        class="text-gray-400 bg-gray-200"
        readonly
        name="filename"
        value={movie.filename}
      /><br />
      <input
        class="text-gray-400 bg-gray-200"
        readonly
        name="duration"
        value={movie.duration}
      /><br />

      <input name="start" /><br />
      <button
        formaction="?/whisper"
        class="p-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
        >whisper</button
      >
      <button
        formaction="?/foo1"
        class="p-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
        >foo1</button
      >
    </div>
  </div>
</form>
{#each segments as s}
  <div class="flex">
    <div class="w-[5ch]">{s.start}</div>
    <div class="w-[5ch]">{s.end}</div>
    <div class="flex-1">{s.text}</div>

    <!--    -->
  </div>
{/each}

<!-- svelte-ignore a11y-media-has-caption -->
<video src={"/" + movie.filename} controls> </video>

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
