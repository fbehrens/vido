<script lang="ts">
  let { time = $bindable(), words } = $props();
  let wordCurrent = (w: any) => time >= w.start && (!w.end || time <= w.end);
</script>

<div class="bg-green-100 whitespace-pre">
  {#each words as word}
    <button class={wordCurrent(word) ? "bg-green-200" : ""} onclick={() => (time = word.start)}
      >{word.word}</button
    >
  {/each}
</div>
