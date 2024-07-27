<script lang="ts">
  import { page } from "$app/stores";

  let { children, data } = $props();
  const { pages } = data;
  const current = $derived($page.route.id?.replace("/mockup/", "")) as string;
</script>

<div class="flex bg-blue-300 w-full">
  <div class="p-1">Mockup:</div>
  {#each pages as p}
    <div class="p-1 {current == p ? 'bg-gray-300' : ''}">
      <a href={`/mockup/${p}`}>{p}</a>
    </div>
  {/each}
</div>
{@render children()}
