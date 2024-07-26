<script lang="ts">
  import type { Segment, Word } from "$lib/types";
  import { alignArrays, wordSep } from "$lib/util/alignArrays";
  type MWord = {
    id: number | undefined;
    segment_id: number | undefined;
    word: string;
    sep: string;
  };
  function color(o: MWord) {
    if (o.id && o.segment_id) {
      return "bg-green-500";
    } else if (!o.id) {
      return "bg-blue-500";
    } else {
      return "bg-red-500";
    }
  }
  let {
    clip_id,
    words,
    segments,
  }: {
    clip_id: number;
    words: Word[];
    segments: Segment[];
  } = $props();

  const swords = $derived(
    segments.flatMap((s) =>
      [...wordSep(s.text)].map((ws) => ({ ...ws, segment_id: s.id })),
    ),
  );
  const mwords = $derived(alignArrays(words, swords) as unknown as MWord[]);
</script>

Clip:{clip_id}
{#each mwords as w}
  <span class={color(w)}>{w.word}</span>{w.sep}
{/each}
