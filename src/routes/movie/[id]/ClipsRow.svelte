<script lang="ts">
  import type { Clip } from "$lib/types";
  import { overlay } from "$lib/util/overlapClips";
  let {
    clips,
    duration,
    clip_ids = $bindable(),
    start = $bindable(),
    length = $bindable(),
    end = $bindable(),
  }: {
    clips: Clip[];
    duration: number;
    clip_ids: Number[];
    start: number;
    length: number;
    end: number;
  } = $props();
  function style(part: { ids: number[]; start: number; end: number }) {
    const width = ((part.end - part.start) / duration) * 100;
    const color = ["bg-gray-200", "bg-blue-300", "bg-blue-400"];
    return {
      class: `${color[part.ids.length]} text-center`,
      style: `flex-basis: ${width}%;`,
    };
  }
</script>

<div class="flex flex-row w-full bg-gray-300">
  {#each overlay(clips) as part}
    <div {...style(part)}>
      <button
        onclick={() => {
          start = part.start;
          end = part.end;
          length = part.end - part.start;
          clip_ids = part.ids;
        }}>{part.ids}</button
      >
    </div>
  {/each}
</div>
