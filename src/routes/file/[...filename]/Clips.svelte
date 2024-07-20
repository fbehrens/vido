<script lang="ts">
  import type { Clip } from "$lib/types";
  import { overlay } from "$lib/util/overlapClips";
  export let clips: Clip[];
  export let duration: number;
  function style(part: { ids: number[]; start: number; end: number }) {
    const width = ((part.end - part.start) / duration) * 100;
    return {
      class: `${part.ids.length == 1 ? "bg-blue-300" : "bg-blue-400"} text-center`,
      style: `flex-basis: ${width}%;`,
    };
  }
</script>

<div class="flex flex-row w-full bg-gray-300">
  {#each overlay(clips) as part}
    <div {...style(part)}><button>{part.ids}</button></div>
  {/each}
</div>
