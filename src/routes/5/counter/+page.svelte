<script>
  import { createCounter } from "./counter.svelte.js";
  const counter = createCounter();
</script>

<button onclick={counter.increment}>
  clicks: {counter.count}
</button>
