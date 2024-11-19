<script>
  import "../app.css";
  let { children } = $props();
</script>

<header class="bg-blue-500 p-4 text-white">
  <div class="flex-container">
    <div class="flex"><p class="text-xl">video transcripting</p></div>
    <a class="text-xs" href="/movie">movie</a>
    <a class="text-xs" href="/yt">youtube</a>
    <a class="text-xs" href="/mockup">mockup</a>
  </div>
</header>

<main class="container mx-auto">
  {@render children()}
</main>
