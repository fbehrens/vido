<script>
  import YouTube from "$lib/components/YouTube.svelte";
  let player;
  let time = $state(0);
</script>

<YouTube bind:player bind:time videoId="LXPZU3pmjPE" />
time={time}
<button onclick={() => player.seekTo(100, true)}>100</button><br />
