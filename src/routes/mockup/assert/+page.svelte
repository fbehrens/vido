<script lang="ts">
  let { data } = $props();
  let { texts } = data;
</script>

{#each texts as text}
  {text}<br />
{/each}
