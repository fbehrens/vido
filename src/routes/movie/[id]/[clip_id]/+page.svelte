<script lang="ts">
  import Srt from "$lib/components/Srt.svelte";

  const { data } = $props();
  const { filename, segments, id, movie_id } = data;
  let currentTime = $state(0);
  const words = segments.flatMap((s: any) => s.words);
  console.log(words[0]);
  let word = $derived(words.find((w) => w.end > currentTime));
</script>

{filename} <br />
<Srt id={movie_id} clip_id={id} />
<audio controls bind:currentTime>
  <source src={filename} type="audio/mpeg" />
</audio>

{currentTime}<br />
{word.word}
