<script lang="ts">
  import type { Segment } from "$lib/types";
  import SegmentRow from "./SegmentRow.svelte";

  let {
    segments,
    time = $bindable(),
    handleSetTime,
    apiDeleteSegment,
  }: {
    segments: Segment[];
    time: number;
    handleSetTime: any;
    apiDeleteSegment: any;
  } = $props();
</script>

<div class="border border-green-300">
  {#each segments as s}
    <SegmentRow
      {...s}
      {time}
      on:deleteSegment
      {handleSetTime}
      {apiDeleteSegment}
    ></SegmentRow>
  {/each}
</div>
