<script lang="ts">
  let { children } = $props();
  let mockups = ["position"];
</script>

<div class="flex">
  <div class="p-1">Mockup:</div>
  {#each mockups as m}
    <div class="p-1"><a href={`mockup/${m}`}>{m}</a></div>
  {/each}
</div>
{@render children()}
