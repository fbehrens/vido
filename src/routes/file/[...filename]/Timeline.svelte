<script lang="ts">
  import { Tooltip } from "flowbite-svelte";
  import type { Segment, Word } from "$lib/types";
  export let words: Word[];
  export let segments: Segment[];
  export let time: number;
  export let duration: number;
  let range1: number = 4;
  const o = {
    max:
      words.reduce(
        (max, current) => Math.max(max, current.start),
        words[0].start,
      ) + 1,
    min:
      words.reduce(
        (min, current) => Math.min(min, current.start),
        words[0].start,
      ) - 1,
    height: 1000,
  };
  // absolute top-[89px] left-[20px] w-[20px] h-[-998px] border-red-500
  const getHeight = (t: number) =>
    Math.ceil(((t - o.min) / (o.max - o.min)) * o.height);

  function word(w: Word): string {
    const left: number = w.clip_id % 2 == 1 ? 30 : 130;
    const start = getHeight(w.start);
    const wHeigth = getHeight(w.end) - start + 1;
    return `top:${start}px; left:${left}px; width:${w.word.length}ch; height:${wHeigth}px`;
  }
</script>

<div class="flex">
  <div class="p-1">{range1}</div>
  <div class="flex-auto">
    <input
      type="range"
      bind:value={range1}
      min="1"
      max="100"
      class="w-full bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-300 h-2"
    />
  </div>
</div>

<div class="relative w-[800px] bg-gray-300" style="min-height: {o.height}px">
  {#each words as w}
    <div
      class="absolute text-xs bg-green-200 border border-green-300"
      style={word(w)}
    >
      {w.word}
    </div>
    <Tooltip
      placement="right"
      type="dark"
      class="text-green-200 bg-black text-xs"
      >start:{w.start}<br />end:{w.end}</Tooltip
    >
  {/each}
</div>
