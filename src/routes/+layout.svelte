<script>
  import "../app.css";
  let { children } = $props();
</script>

<header class="bg-blue-500 p-4 text-white">
  <h1 class="text-2xl font-bold">video transcripting</h1>
</header>

<main class="container mx-auto p-4">
  {@render children()}
</main>
