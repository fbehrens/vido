<script lang="ts">
  import type { Segment } from "$lib/types";
  import SegmentRow from "./SegmentRow.svelte";
  export let segments: Segment[];
  export let time: number;
</script>

{#each segments as s}
  <SegmentRow
    clip_id={s.clip_id}
    id={s.id}
    start={s.start}
    end={s.end}
    text={s.text}
    dublicate={s.dublicate}
    bind:time
    on:delete
    on:setTime
  ></SegmentRow>
{/each}
