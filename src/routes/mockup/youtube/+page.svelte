<script>
  import YouTube from "$lib/components/YouTube.svelte";
  let player;
</script>

<YouTube bind:player videoId="dQw4w9WgXcQ" />
<button onclick={() => player.seekTo(100, true)}>100</button>
