<script lang="ts">
  import type { Segment } from "$lib/types";
  import SegmentRow from "./SegmentRow.svelte";

  let {
    segments,
    time = $bindable(),
  }: {
    segments: Segment[];
    time: number;
  } = $props();
</script>

<div class="border border-green-300">
  {#each segments as s}
    <SegmentRow {...s} bind:time></SegmentRow>
  {/each}
</div>
