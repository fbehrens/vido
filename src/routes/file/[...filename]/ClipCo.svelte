<script lang="ts">
  import type { Segment, Word } from "$lib/types";
  import { alignArrays, wordSep } from "$lib/util/alignArrays";
  type MWord = {
    id: number | undefined;
    segment_id: number | undefined;
    word: string;
    sep: string;
  };

  const apiStoreWords = async (mwords: MWord[]) => {
    const response = await fetch("/api/storeWords", {
      method: "POST",
      body: JSON.stringify(
        mwords.map(({ id, segment_id, sep }) => ({ id, segment_id, sep })),
      ),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log({ responseJson: await response.json() });
    }
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
{#if words.length && !words[0].segment_id}
  <div class="w-full">
    {#each mwords as w}
      <span class={color(w)}>{w.word}</span>
      {w.sep}&nbsp;
    {/each}
  </div>
  <button
    onclick={() => apiStoreWords(mwords)}
    class="p-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
    >store</button
  >
{/if}
