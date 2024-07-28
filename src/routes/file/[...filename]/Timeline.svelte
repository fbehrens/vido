<script lang="ts">
  import { Tooltip } from "flowbite-svelte";
  import type { Segment, Word } from "$lib/types";
  let {
    words = $bindable(),
    segments = $bindable(),
    time = $bindable(),
    start,
    end,
    togglePaused,
  }: {
    words: Word[];
    segments: Segment[];
    time: number;
    start: number;
    end: number;
    togglePaused: () => void;
  } = $props();
  let range1: number = $state(4);
  let height = 1000;

  // absolute top-[89px] left-[20px] w-[20px] h-[-998px] border-red-500
  const getHeight = (t: number) =>
    Math.ceil(((t - start) / (end - start)) * height);

  function playing(w: { start: number; end: number }): boolean {
    return w.start < time && time < w.end;
  }
  function style(
    e: { start: number; end: number; clip_id: number },
    width: number,
  ): string {
    const left: number = (e.clip_id % 2 == 1 ? 45 : 150) - width / 2;
    const start = getHeight(e.start);
    const wHeigth = getHeight(e.end) - start + 1;
    return `top:${start}px; left:${left}px; width:${width}px; height:${wHeigth}px`;
  }
  const selWords = $derived(
    words.filter((e) => e.start >= start && e.end < end),
  );
  const selSegments = $derived(
    segments.filter((e) => e.start >= start && e.end < end),
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

<div
  class="relative w-full bg-gray-300"
  style="min-height: {height}px"
  role="button"
  tabindex="0"
  onkeydown={(e) => {
    console.log(e);
    if (e.key == " ") {
      e.preventDefault();
      togglePaused();
    }
  }}
>
  {#each selWords as e}
    <div
      class="absolute text-xs bg-green-200 border border-green-300 z-10 {playing(
        e,
      )
        ? 'font-bold'
        : ''}"
      style={style(e, 60)}
    >
      <button onclick={() => (time = e.start)}>{e.word}{e.sep}</button>
    </div>
    <Tooltip
      placement="right"
      type="dark"
      class="text-green-200 bg-black text-xs z-20"
      >start:{e.start}<br />end:{e.end}</Tooltip
    >
  {/each}
  {#each selSegments as e}
    <div
      class="absolute text-xs bg-green-300 border border-green-800 z-5 {playing(
        e,
      )
        ? 'font-bold'
        : ''}"
      style={style(e, 80)}
    >
      <button onclick={() => (time = e.start)}></button>
    </div>
    <Tooltip
      placement="right"
      type="dark"
      class="text-green-200 bg-black text-xs z-20">{e.text}</Tooltip
    >
  {/each}
</div>
