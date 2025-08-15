<script>
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
  let { children } = $props();
</script>

<Header>theHeader</Header>
<main>
  <svelte:boundary>
    {@render children?.()}

    {#snippet pending()}
      <p>loading...</p>
    {/snippet}
  </svelte:boundary>
</main>
