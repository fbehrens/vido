<script lang="ts">
  let { data } = $props();
  let { texts } = data;
  console.log(texts);
</script>

{#each texts as text}
  {text}<br />
{/each}
