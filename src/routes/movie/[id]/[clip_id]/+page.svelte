<script lang="ts">
  const { data } = $props();
  const { filename, segments, id, movie_id } = data;
  let currentTime = $state(0);
  const words = segments.flatMap((s: any) => s.words);
  console.log(words[0]);
  let word = $derived(words.find((w) => w.end > currentTime));
</script>

{filename} <br />
download srt
<a href="/api/srt?id={movie_id}&clip_id={id}&unit=word">word</a>&nbsp;<a
  href="/api/srt?id={movie_id}&clip_id={id}&unit=segment">segment</a
>
<audio controls bind:currentTime>
  <source src={filename} type="audio/mpeg" />
</audio>

{currentTime}<br />
{word.word}
