<script lang="ts">
  import { page } from "$app/stores";
  const src = "/" + $page.params.src;
  function handleError(event: Event) {
    console.error(
      "Error loading video:",
      (event.target as HTMLVideoElement).error,
    );
  }
</script>

the file: {src}
<form method="POST" action="?/foo">
  <input type="hidden" name="id" value={src} />
  <button
    class="p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
    >foo</button
  >
</form>

<!-- svelte-ignore a11y_media_has_caption -->
<video
  poster="https://sveltejs.github.io/assets/caminandes-llamigos.jpg"
  {src}
  controls
>
</video>

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
