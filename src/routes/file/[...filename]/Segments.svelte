<script lang="ts">
  import type { Segment } from "$lib/types";
  import SegmentRow from "./SegmentRow.svelte";
  export let segments: Segment[];
  export let time: number;
</script>

{#each segments as s}
  <SegmentRow {...s} bind:time on:delete on:setTime></SegmentRow>
{/each}
