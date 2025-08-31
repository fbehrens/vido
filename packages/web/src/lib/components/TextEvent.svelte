<script lang="ts">
  import Seg from "./Seg.svelte";

  let { tStartMs, segs, time = $bindable(), seek } = $props();
  const hhMmSs = (ms: number) => new Date(ms).toISOString().slice(11, 19);
</script>

<button onclick={() => seek(tStartMs)}>{hhMmSs(tStartMs)}</button>&nbsp;
{#each segs as seg}
  <Seg bind:time text={seg.utf8} start={tStartMs + seg.tOffsetMs!} />
{/each}
<br />
