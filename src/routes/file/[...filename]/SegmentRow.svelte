<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let clip: number;
  export let id: number;
  export let start: number;
  export let end: number;
  export let text: string;
  export let dublicate: boolean;
  const dispatch = createEventDispatcher();
</script>

<div class="flex">
  <div class="w-[7ch]">{clip}</div>
  <div class="w-[7ch]">{start}</div>
  <div class="w-[7ch]">{end}</div>
  <div class:red={dublicate} class="flex-1">{text}</div>
  <button on:click={() => dispatch("delete", { clip, id })}>delete</button>
</div>

<style>
  .red {
    color: red;
  }
</style>
