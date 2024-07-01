<script lang="ts">
  export let data;
  let { src } = data;
</script>

<br />the file: {src}
<form method="POST" action="?/foo">
  <input type="hidden" name="id" value={src} />
  <button
    class="p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
    >foo</button
  >
</form>

<!-- svelte-ignore a11y-media-has-caption -->
<video {src} controls> </video>

<style>
  video {
    max-width: 100%;
    height: auto;
  }
</style>
