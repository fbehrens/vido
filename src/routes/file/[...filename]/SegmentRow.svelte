<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Word } from "$lib/types";
  //   import WordsTable from "$lib/components/WordsTable.svelte";
  import Icon from "$lib/components/Icon.svelte";

  export let clip_id: number;
  export let time;
  export let id: number;
  export let start: number;
  export let end: number;
  export let text: string;
  const dispatch = createEventDispatcher();
  $: isCurrent = time >= start && time <= end;
</script>

<div class="flex">
  <div class="w-[10ch]">
    <button on:click={() => dispatch("delete", { id })}>
      <Icon name="delete" />
    </button>
    {clip_id}
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="w-[7ch]" on:click={() => dispatch("setTime", { time: start })}>
    {start.toFixed(2)}
  </div>
  <div class="w-[7ch]">{end.toFixed(2)}</div>
  <div class="flex-1 {isCurrent ? 'bg-green-200' : ''}">
    {text}
  </div>
</div>
