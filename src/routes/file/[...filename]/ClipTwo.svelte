<script lang="ts">
  import type { Segment, Word } from "$lib/types";
  import { alignArrays } from "$lib/util/alignArrays";

  let {
    clip_ids,
    words,
    segments,
  }: {
    clip_ids: number[];
    words: Word[];
    segments: Segment[];
  } = $props();
  let colors = ["bg-blue-200", "bg-red-200", "bg-green-200"];
  let color = (w: any) => {
    if (w[0] && w[1]) {
      return colors[2];
    } else if (w[0]) {
      return colors[0];
    }
    return colors[1];
  };
  let [w0, w1] = $derived(
    clip_ids.map((c, ci) =>
      words
        .filter(({ clip_id }) => clip_id == c)
        .map((w) => ({ ...w, [ci]: w.id })),
    ),
  );
  const mWords = $derived(alignArrays(w0, w1) as any[]);
  console.table(mWords);
  function cutAfter(index: number) {
    let ids = [
      ...mWords.slice(0, index + 1).map((w) => w[1]),
      ...mWords.slice(index + 1).map((w) => w[0]),
    ].filter((e) => e);
    words = words.filter(({ id }) => !ids.includes(id));
  }
</script>

<div class="mx-auto">
  <span class="text-xl {colors[0]}">&nbsp;Clip:{clip_ids[0]}&nbsp;</span>
  {#each mWords as w, index}
    <span class={color(w)}>{w.word}</span>{w.sep}<button
      class="cursor-col-resize"
      onclick={() => cutAfter(index)}>|&nbsp;</button
    >
  {/each}
  <span class="text-xl {colors[1]}">&nbsp;Clip:{clip_ids[1]}&nbsp;</span>
</div>
