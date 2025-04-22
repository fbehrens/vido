<script>
  import YouTube from "$lib/components/YouTube.svelte";
  let player;
  let time = $state(0);
</script>

<YouTube bind:player bind:time videoId="dQw4w9WgXcQ" />
time={time}
<button onclick={() => player.seekTo(100, true)}>100</button><br />
