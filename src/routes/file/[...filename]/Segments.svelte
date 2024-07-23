<script lang="ts">
  import type { Segment } from "$lib/types";
  import SegmentRow from "./SegmentRow.svelte";
  export let segments: Segment[];
  export let time: number;
</script>

<div class="border border-green-300">
  {#each segments as s}
    <SegmentRow {...s} {time} on:deleteSegment on:setTime></SegmentRow>
  {/each}
</div>
