<script lang="ts">
  import type { Segment, Word } from "$lib/types";

  let { data } = $props();
  let { movie, clips } = data;
  const overlaps = clips //
    .map((clip, index) => {
      if (!index) return;
      const prev = clips[index - 1];
      return {
        start: clip.start,
        end: prev.end,
        seg: (JSON.parse(prev.segments) as Segment[]).filter(
          (s) => s.end >= clip.start,
        ),
        nxt: (JSON.parse(clip.segments) as Segment[]).filter(
          (s) => s.start <= prev.end,
        ),
      };
    })
    .filter((c) => c !== undefined);

  let seconds = $state(10); //
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
      const addValid = (nxt: boolean) => {
        return (o: any) => ({
          ...o,
          valid: nxt ? o.startPos > 50 : o.startPos <= 50,
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
        .map(addValid(false));
      const nxtPos = ol.nxt
        .map(addPos)
        .filter(inRange)
        .map(clipBorders)
        .map(addValid(true));
      const segWords = (segPos.flatMap((s: any) => s.words) as Word[])
        .map(addPos)
        .filter(inRange)
        .map(clipBorders)
        .map(addValid(false));
      const nxtWords = (nxtPos.flatMap((s: any) => s.words) as Word[])
        .map(addPos)
        .filter(inRange)
        .map(clipBorders)
        .map(addValid(true));
      return { index, ...ol, segPos, segWords, cut: cut[index] };
    }),
  );
  //   $effect(() => {
  //     console.log(rOverlaps[0]);
  //     console.table(rOverlaps[0].segPos);
  //     console.table(rOverlaps[0].segWords);
  //   });
</script>

<form>
  <div class="flex">
    <label for="sec">{seconds}seconds:</label>
    <input type="range" id="sec" min="5" max="20" bind:value={seconds} />
  </div>
</form>

<form class="w-full">
  {#each rOverlaps as ol}
    <div>
      <input
        type="range"
        id="cutAt_0"
        name="cutAt_0"
        min={ol.start}
        max={ol.end}
        step="any"
        bind:value={cut[ol.index]}
      />
      <div
        class="bg-blue-100 relative text-xs h-10 border border-y-1 border-blue-600"
      >
        <div
          class="absolute h-10 border-l-2 border border-black"
          style="left:50%;"
        ></div>
        <span>{ol.index}</span>
        {#each ol.segWords as w}
          <span
            class="absolute bg-blue-300 my-3 border-black border z-10 {w.valid
              ? ''
              : 'text-slate-500'}"
            style="left:{w.startPos}%;right:{100 - w.endPos}%;"
            >{w.word}{w.sep}</span
          >
        {/each}
        {#each ol.segPos as w}
          <span
            class="absolute bg-blue-400 h-8 my-1 z-0 border border-white border-x-2"
            style="left:{w.startPos}%;right:{100 - w.endPos}%;"
          ></span>
        {/each}
      </div>
      <div class="bg-blue-200">{ol.index + 1}</div>
    </div>
  {/each}
</form>

<style>
  input {
    width: 100%;
  }
</style>
