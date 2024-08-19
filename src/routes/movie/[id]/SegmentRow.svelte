<script lang="ts">
  import type { Word } from "$lib/types";

  let {
    time = $bindable(),
    start,
    end,
    words,
  }: {
    time: number;
    start: number;
    end: number;
    words: Word[];
  } = $props();
  let wordCurrent = (w: any) => time >= w.start && time <= w.end;
</script>

<div class="bg-green-100">
  {#each words as word}
    <button class={wordCurrent(word) ? "bg-green-200" : ""}
      >{word.word}{word.sep}&nbsp;</button
    >
  {/each}
</div>
