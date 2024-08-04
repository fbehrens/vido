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
      const addPos = (o: { start: number; end: number }) => ({
        ...o,
        startPos: pos(o.start),
        endPos: pos(o.end),
      });
      const inRange = (s: { startPos: number; endPos: number }) =>
        s.endPos >= 0 && s.startPos <= 100;
      const addValid = (nxt: boolean) => {
        return (o: { startPos: number }) => ({
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
      const segWords = segPos
        ?.flatMap((s: any) => s.words)
        .map(addPos)
        .filter(inRange)
        .map(clipBorders)
        .map(addValid(false));
      return { index, ...ol, segPos, segWords, cut: cut[index] };
    }),
  );
  let selStart = $derived(cut.map((v) => v - seconds / 2));
  $effect(() => {
    console.log(rOverlaps[0]);
    console.table(rOverlaps[0].segPos);
    console.table(rOverlaps[0].segWords);
  });
</script>

<form>
  <div class="flex">
    <label for="sec">{seconds}seconds:</label>
    <input type="range" id="sec" min="5" max="20" bind:value={seconds} />
  </div>
</form>

<form class="w-full">
  {#each rOverlaps.slice(0, 1) as ol}
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
      <div class="bg-blue-200 relative">
        {ol.index}

        <span class="absolute bg-blue-300" style="left:10%;right:89%;"
          >Hello</span
        >
      </div>
      <div class="bg-green-200">{ol.index + 1}</div>
    </div>
  {/each}
</form>

<style>
  input {
    width: 100%;
  }
</style>
