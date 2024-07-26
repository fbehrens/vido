<script lang="ts">
  import { Tooltip } from "flowbite-svelte";
  import type { Segment, Word } from "$lib/types";
  let {
    words,
    segments,
    time = $bindable(),
    start,
    end,
    duration,
  }: {
    words: Word[];
    segments: Segment[];
    time: number;
    start: number;
    end: number;
    duration: number;
  } = $props();
  let range1: number = $state(4);
  let height = 1000;

  // absolute top-[89px] left-[20px] w-[20px] h-[-998px] border-red-500
  const getHeight = (t: number) =>
    Math.ceil(((t - start) / (end - start)) * height);

  function playing(w: { start: number; end: number }): boolean {
    return w.start < time && time < w.end;
  }
  function style(w: Word): string {
    const left: number = w.clip_id % 2 == 1 ? 30 : 130;
    const start = getHeight(w.start);
    const wHeigth = getHeight(w.end) - start + 1;
    return `top:${start}px; left:${left}px; width:${w.word.length}ch; height:${wHeigth}px`;
  }
  const selWords = $derived(
    words.filter((w) => w.start > start && w.end < end),
  );
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

<div class="relative w-full bg-gray-300" style="min-height: {height}px">
  {#each selWords as w}
    <div
      class="absolute text-xs bg-green-200 border border-green-300 {playing(w)
        ? 'font-bold'
        : ''}"
      style={style(w)}
    >
      <button onclick={() => (time = w.start)}>{w.word}</button>
    </div>
    <Tooltip
      placement="right"
      type="dark"
      class="text-green-200 bg-black text-xs"
      >start:{w.start}<br />end:{w.end}</Tooltip
    >
  {/each}
</div>
