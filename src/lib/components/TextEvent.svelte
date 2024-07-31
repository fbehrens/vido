<script lang="ts">
  import type { Json3Seg } from "$lib/types";
  import Seg from "./Seg.svelte";

  let {
    tStartMs,
    segs,
    time = $bindable(),
    seek,
  }: {
    tStartMs: number;
    segs: Json3Seg[];
    time: number;
    seek: (ms: number) => void;
  } = $props();
  const hhMmSs = (ms: number) => new Date(ms).toISOString().slice(11, 19);
</script>

<button onclick={() => seek(tStartMs)}>{hhMmSs(tStartMs)}</button>&nbsp;
{#each segs as seg}
  <Seg bind:time text={seg.utf8} start={tStartMs + seg.tOffsetMs!} />
{/each}
<br />
