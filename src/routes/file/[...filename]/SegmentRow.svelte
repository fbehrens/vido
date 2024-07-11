<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { WordDb } from "$lib/types";
  import WordsTable from "$lib/components/WordsTable.svelte";

  export let clip_id: number;
  export let time;
  //   export let words: WordDb[];
  export let id: number;
  export let start: number;
  export let end: number;
  export let text: string;
  export let dublicate: boolean;
  const dispatch = createEventDispatcher();
  $: isCurrent = time >= start && time <= end;
</script>

<div class="flex">
  <div class="w-[10ch]">
    <button on:click={() => dispatch("delete", { id })}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 256 256"
        {...$$props}
        ><path
          fill="currentColor"
          d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"
        /></svg
      >
    </button>
    {clip_id}
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="w-[7ch]" on:click={() => dispatch("setTime", { time: start })}>
    {start.toFixed(2)}
  </div>
  <div class="w-[7ch]">{end.toFixed(2)}</div>
  <div class:red={dublicate} class="flex-1 {isCurrent ? 'bg-green-200' : ''}">
    {text}
  </div>
</div>

<style>
  .red {
    color: red;
  }
</style>
