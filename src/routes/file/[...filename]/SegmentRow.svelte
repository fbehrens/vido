<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { WordDb } from "$lib/types";
  import WordsTable from "$lib/components/WordsTable.svelte";

  export let clip_id: number;
  export let time;
  export let words: WordDb[];
  export let id: number;
  export let start: number;
  export let end: number;
  export let text: string;
  export let dublicate: boolean;
  const dispatch = createEventDispatcher();
  $: isCurrent = time >= start && time <= end;
</script>

<div class="flex">
  <div class="w-[7ch]">{time}</div>
  <div class="w-[7ch]">{start.toFixed(2)}</div>
  <div class="w-[7ch]">{end.toFixed(2)}</div>
  <div class:red={dublicate} class="flex-1 {isCurrent ? 'bg-green-200' : ''}">
    {text}
    <!-- <WordsTable {words}></WordsTable> -->
  </div>
  <button on:click={() => dispatch("delete", { clip_id, id })}>delete</button>
</div>

<style>
  .red {
    color: red;
  }
</style>
