<script lang="ts">
  let { children, data } = $props();
  const { pages } = data;
</script>

<div class="flex">
  <div class="p-1">Mockup:</div>
  {#each pages as p}
    <div class="p-1"><a href={`/mockup/${p}`}>{p}</a></div>
  {/each}
</div>
{@render children()}
