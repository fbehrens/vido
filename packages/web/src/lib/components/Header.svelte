<script lang="ts">
  import { page } from "$app/state";
  import { cn } from "$lib/utils.js";
</script>

<header>
  <div class="hidden md:flex">
    <p class="mr-6">video transcripting</p>
    <nav class="flex items-center gap-6 text-sm">
      {#snippet entry(route: string)}
        <a
          class={cn(
            "transition-colors hover:text-foreground/80",
            page.url.pathname.startsWith("/" + route)
              ? "bg-blue-100 text-foreground"
              : "text-foreground/60",
          )}
          href={"/" + route}>{route}</a
        >
      {/snippet}
      {@render entry("files")}
      {@render entry("movie")}
      {@render entry("yt")}
      {@render entry("mediathek")}
      {@render entry("mockup")}
    </nav>
  </div>
</header>
