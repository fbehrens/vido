<script lang="ts">
  const { data } = $props();
  let { words, segments } = data;
</script>

<div class="flex text-xs">
  <div>
    {#each words as w}
      {w.id},{w.word}<br />
    {/each}
  </div>
  <div>
    {#each segments as s}
      {s.id},{s.word}<br />
    {/each}
  </div>
</div>
