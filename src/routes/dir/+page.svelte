<script lang="ts">
  import File from "./file.svelte";
  let { data } = $props();
  let fltr = $state("");
  let filtrd = $derived(data.files.filter((e) => e.file.includes(fltr)));
  //   console.log(data)
</script>

<main>
  <p><input bind:value={fltr} /></p>
  <ul>
    {#each filtrd as f}
      <li>
        <File {...f} />
      </li>
    {/each}
  </ul>
</main>

<style>
</style>
