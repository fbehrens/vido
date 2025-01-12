<script lang="ts">
  import { page } from "$app/state";
  import { cn } from "$lib/utils.js";
</script>

<header>
  <div class="hidden md:flex">
    <p class="mr-6">video transcripting</p>
    <nav class="flex items-center gap-6 text-sm">
      <a
        class={cn(
          "transition-colors hover:text-foreground/80",
          page.url.pathname.startsWith("/files")
            ? "text-foreground"
            : "text-foreground/60",
        )}
        href="/files">files</a
      >
      <a
        class={cn(
          "transition-colors hover:text-foreground/80",
          page.url.pathname.startsWith("/movie")
            ? "text-foreground"
            : "text-foreground/60",
        )}
        href="/movie">movie</a
      >
      <a
        class={cn(
          "transition-colors hover:text-foreground/80",
          page.url.pathname.startsWith("/yt")
            ? "text-foreground"
            : "text-foreground/60",
        )}
        href="/yt">youtube</a
      >
      <a
        class={cn(
          "transition-colors hover:text-foreground/80",
          page.url.pathname.startsWith("/mockup")
            ? "text-foreground"
            : "text-foreground/60",
        )}
        href="/mockup">mockup</a
      >
    </nav>
  </div>
</header>
