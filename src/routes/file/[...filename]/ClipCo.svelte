<script lang="ts">
  import type { Segment, Word } from "$lib/types";
  let {
    clip_id,
    words,
    segments,
  }: {
    clip_id: number;
    words: Word[];
    segments: Segment[];
  } = $props();
  const sgmtss = segments.map((s) => ({
    ...s,
    words: s.text.match(/\b[\w']+\b/g),
  }));

  console.log(words[0], segments[0]);
</script>

<div>
  {#each segments as s}
    {s.text}<br />
  {/each}
</div>
<div>
  {#each words as w}
    {w.word}&nbsp;
  {/each}
</div>
