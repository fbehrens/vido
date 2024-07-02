<script lang="ts">
  export let data;
  import { enhance } from "$app/forms";
  import type { ActionResult, SubmitFunction } from "@sveltejs/kit";

  let result: ActionResult;

  const handleSubmit: SubmitFunction = () => {
    return async ({ result }) => {
      if (result.type === "success") {
        console.log(result.data!.data);
      }
    };
  };
  let { movie } = data;
</script>

<form method="POST" use:enhance={handleSubmit}>
  filename:<input readonly name="filename" value={movie.filename} /><br />
  description:<input name="description" /><br />
  <button
    formaction="?/foo"
    class="p-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
    >foo</button
  >
  <button
    formaction="?/foo1"
    class="p-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
    >foo1</button
  >
</form>

<!-- svelte-ignore a11y-media-has-caption -->
<video src={movie.filename} controls> </video>

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
