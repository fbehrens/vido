<script lang="ts">
  import type { Segment, Word } from "$lib/types";
  let { data } = $props();
  let { movie, clps } = data;

  let seconds = $state(10); //
  const overlaps = clps //
    .map((clip, index) => {
      if (!index) return;
      const prev = clps[index - 1];
      return {
        start: clip.start,
        end: prev.end,
        seg: (JSON.parse(prev.segments!) as Segment[]).filter(
          (s) => s.end >= clip.start,
        ),
        nxt: (JSON.parse(clip.segments!) as Segment[]).filter(
          (s) => s.start <= prev.end,
        ),
      };
    })
    .filter((c) => c !== undefined);

  let cut = $state(overlaps.map(({ start, end }) => (start + end) / 2));

  let rOverlaps = $derived(
    overlaps.map((ol, index) => {
      const pos = function (time: number) {
        return ((time - cut[index] + seconds) / seconds) * 100;
      };
      const addPos = (o: Word | Segment) => ({
        ...o,
        startPos: pos(o.start),
        endPos: pos(o.end),
      });
      const inRange = (s: { startPos: number; endPos: number }) =>
        s.endPos >= 0 && s.startPos <= 100;
      const addInvalid = (nxt: boolean) => {
        return (o: any) => ({
          ...o,
          invalid: nxt ? o.startPos <= 50 : o.startPos > 50,
        });
      };
      const clipBorders = (o: { startPos: number; endPos: number }) => ({
        ...o,
        startPos: Math.max(0, o.startPos),
        endPos: Math.min(100, o.endPos),
      });
      const segPos = ol.seg
        .map(addPos)
        .filter(inRange)
        .map(clipBorders)
        .map(addInvalid(false));
      const nxtPos = ol.nxt
        .map(addPos)
        .filter(inRange)
        .map(clipBorders)
        .map(addInvalid(true));
      const segWords = (segPos.flatMap((s: any) => s.words) as Word[])
        .map(addPos)
        .filter(inRange)
        .map(clipBorders)
        .map(addInvalid(false));
      const nxtWords = (nxtPos.flatMap((s: any) => s.words) as Word[])
        .map(addPos)
        .filter(inRange)
        .map(clipBorders)
        .map(addInvalid(true));
      return {
        index,
        ...ol,
        segPos,
        segWords,
        nxtPos,
        nxtWords,
        cut: cut[index],
      };
    }),
  );
  $effect(() => {
    console.log(rOverlaps[0]);
    // console.table(rOverlaps[0].segPos);
    // console.table(rOverlaps[0].segWords);
  });
</script>

<form>
  <div class="flex">
    <label class="whitespace-nowrap" for="sec">Showing {seconds}seconds:</label>
    <input type="range" id="sec" min="5" max="20" bind:value={seconds} />
  </div>
</form>

<form class="w-full" method="post">
  <input hidden name="movie_id" value={movie.id} />
  {#each rOverlaps as ol}
    <div>
      <input
        type="range"
        name="cut"
        min={ol.start}
        max={ol.end}
        step="any"
        bind:value={cut[ol.index]}
      />
      {@render timeline(ol.segPos, ol.segWords, ol.index)}
      {@render timeline(ol.nxtPos, ol.nxtWords, ol.index + 1)}
    </div>
  {/each}
  <button
    type="submit"
    class="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
    >Join Clips</button
  >
</form>

{#snippet timeline(segs: any, words: any, index: number)}
  <div
    class="bg-blue-100 relative text-xs h-10 border border-y-1 border-blue-600"
  >
    <div
      class="absolute h-10 border-l-1 border border-black"
      style="left:50%;"
    ></div>
    {#each segs as w}
      <span
        class="absolute bg-blue-400 h-8 my-1 z-0 border border-white border-x-1"
        style="left:{w.startPos}%;right:{100 - w.endPos}%;"
      ></span>
    {/each}
    {#each words as w}
      <span
        class:text-slate-500={w.invalid}
        class="absolute bg-blue-300 my-3 border-black border z-10"
        style="left:{w.startPos}%;right:{100 - w.endPos}%;"
        >{w.word}{w.sep}</span
      >
    {/each}
    <span
      class="absolute z-20 bg-white border-r-[1px] border-b-[1px] pr-1 border-black font-bold"
      style="left:0%">{index}</span
    >
  </div>
{/snippet}

<style>
  input {
    width: 100%;
  }
</style>
