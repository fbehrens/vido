<script lang="ts">
  let { file, isVdo } = $props();
</script>

<main>
  <p class:is-vdo={isVdo}>{file}</p>
</main>

<style>
  .is-vdo {
    color: red;
  }
</style>
