<script lang="ts">
  import { page } from "$app/state";
  import { cn } from "$lib/utils";
  import { getMockups } from "./data.remote";
  let { children } = $props();
</script>

<div class="border-grey flex items-center gap-2 border-[1px] text-sm">
  {#each await getMockups() as p}
    <a
      class={cn(
        "hover:text-foreground/80 transition-colors",
        `/mockup/${p}` == page.route.id ? "text-foreground" : "text-foreground/60",
      )}
      href={`/mockup/${p}`}>{p}</a
    >
  {/each}
</div>
{@render children()}
