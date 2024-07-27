<script>
  import YouTube from "$lib/components/YouTube.svelte";
  let player;
</script>

<YouTube bind:player initialVideoId="dQw4w9WgXcQ" />
<button on:click={() => player.seekTo(100, true)}>100</button>
