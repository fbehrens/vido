<script lang="ts">
  import { page } from "$app/state";
  import { cn } from "$lib/utils";

  let { children, data } = $props();
  const { pages } = data;
</script>

<div class="flex items-center gap-2 text-sm border-[1px] border-grey">
  {#each pages as p}
    <a
      class={cn(
        "transition-colors hover:text-foreground/80",
        `/mockup/${p}` == page.route.id
          ? "text-foreground"
          : "text-foreground/60",
      )}
      href={`/mockup/${p}`}>{p}</a
    >
  {/each}
</div>
{@render children()}
