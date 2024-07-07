<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { WordDb } from "$lib/types";
  import WordsTable from "$lib/components/WordsTable.svelte";

  export let clip_id: number;
  export let words: WordDb[];
  export let id: number;
  export let start: number;
  export let end: number;
  export let text: string;
  export let dublicate: boolean;
  const dispatch = createEventDispatcher();
</script>

<div class="flex">
  <div class="w-[7ch]">{clip_id}</div>
  <div class="w-[7ch]">{start.toFixed(2)}</div>
  <div class="w-[7ch]">{end.toFixed(2)}</div>
  <div class:red={dublicate} class="flex-1">
    {text}
    <!-- <WordsTable {words}></WordsTable> -->
    {#each words as w}
      {w.word}
    {/each}
  </div>
  <button on:click={() => dispatch("delete", { clip_id, id })}>delete</button>
</div>

<style>
  .red {
    color: red;
  }
</style>
