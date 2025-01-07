<script lang="ts">
  import { page } from "$app/state";
  import { cn } from "$lib/utils";

  let { children, data } = $props();
  const { pages } = data;
</script>

<div class="flex border-2 border-black">
  {#each pages as p}
    <div
      class={cn("p-1", `/mockup/${p}` == page.route.id ? "bg-gray-300" : "")}
    >
      <a href={`/mockup/${p}`}>{p}</a>
    </div>
  {/each}
</div>
{@render children()}
