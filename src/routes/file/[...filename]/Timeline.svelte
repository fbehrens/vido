<script lang="ts">
  import type { Segment, WordDb } from "$lib/types";
  export let words: WordDb[];
  export let segments: Segment[];
  export let time: number;
  export let duration: number | undefined;
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

  function word(w: WordDb): string {
    const left: number = w.clip_id % 2 == 1 ? 30 : 40;
    const start = getHeight(w.start);
    const wHeigth = getHeight(w.end) - start + 1;
    return `top:${start}px; left:${left}px; width:${w.word.length}ch; height:${wHeigth}px`;
  }
</script>

<button
  data-tooltip-target="tooltip-default"
  type="button"
  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  >Default tooltip</button
>

<div
  id="tooltip-default"
  role="tooltip"
  class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
>
  Tooltip content
  <div class="tooltip-arrow" data-popper-arrow></div>
</div>

<div class="relative w-[800px] bg-gray-300" style="min-height: {o.height}px">
  {#each words as w}
    <div
      class="absolute text-xs bg-green-200 border border-green-300"
      style={word(w)}
    >
      {w.word}
    </div>
  {/each}
</div>
