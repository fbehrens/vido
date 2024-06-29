<script lang="ts">
  let { file, isDir } = $props();
</script>

<main>
  <p class:is-dir={isDir}>{file}</p>
</main>

<style>
  .is-dir {
    color: red;
  }
</style>
