<script lang="ts">
  const { data } = $props();
  const { filename, segments } = data;
  let currentTime = $state(0);
  const words = segments.flatMap((s: any) => s.words);
  console.log(words[0]);
  let word = $derived(words.find((w) => w.end > currentTime));
</script>

{filename}
<audio controls bind:currentTime>
  <source src={filename} type="audio/mpeg" />
</audio>

{currentTime}<br />
{word.word}
