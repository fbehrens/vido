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
