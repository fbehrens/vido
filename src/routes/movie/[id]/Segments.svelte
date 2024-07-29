<script lang="ts">
  import type { Segment } from "$lib/types";
  import SegmentRow from "./SegmentRow.svelte";

  let {
    segments,
    time = $bindable(),
    apiDeleteSegment,
  }: {
    segments: Segment[];
    time: number;
    apiDeleteSegment: any;
  } = $props();
</script>

<div class="border border-green-300">
  {#each segments as s}
    <SegmentRow {...s} bind:time {apiDeleteSegment}></SegmentRow>
  {/each}
</div>
