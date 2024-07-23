<script lang="ts">
  import type { Segment } from "$lib/types";
  import SegmentRow from "./SegmentRow.svelte";

  let {
    segments,
    time = $bindable(),
    setTime,
    apiDeleteSegment,
  }: {
    segments: Segment[];
    time: number;
    setTime: any;
    apiDeleteSegment: any;
  } = $props();
</script>

<div class="border border-green-300">
  {#each segments as s}
    <SegmentRow {...s} {time} {setTime} {apiDeleteSegment}></SegmentRow>
  {/each}
</div>
