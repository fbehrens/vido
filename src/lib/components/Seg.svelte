<script lang="ts">
  let {
    text,
    start,
    time = $bindable(),
  }: { text: string; start: number; time: number } = $props();
</script>

<!-- <button onclick={() => (time = start / 1000)}>{text}</button> -->
{text}
