<script lang="ts">
  import type { Word } from "$lib/types";

  let { time = $bindable(), words } = $props();
  let wordCurrent = (w: any) => time >= w.start && time <= w.end;
</script>

<div class="bg-green-100">
  {#each words as word}
    <button class={wordCurrent(word) ? "bg-green-200" : ""} onclick={() => (time = word.start)}
      >{word.word}</button
    >
  {/each}
</div>
