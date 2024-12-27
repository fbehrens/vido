<script lang="ts">
  import TextEvent from "$lib/components/TextEvent.svelte";
  import YouTube from "$lib/components/YouTube.svelte";
  import type { Json3Event, Json3Event1 } from "$lib/types.js";
    import { json3 } from "$lib/yt.js";

  let { data } = $props();
  let time = $state(0);
  let player = $state<YT.Player>();
  let {  id, title, chapters, json3:json4 } = data;

  const js = json3(json4);
  const es = js.events;
  const [e1, ...events] = es ;
  const textEvents = events.filter((e) => !e.aAppend);
  let current = $derived.by(() => {
    const i = textEvents.findIndex((e) => e.tStartMs + 100 > time * 1000);
    return textEvents.slice(i ? i - 1 : i, i + 20);
  });
  const seek = (ms: number): void => player.seekTo(ms / 1000);
  //   assert();
  function assert() {
    const aAppend = events.filter((e) => e.aAppend);
    console.assert(aAppend.every((e) => e.segs?.length == 1));
    console.assert(aAppend.every((e) => e.segs![0].utf8 == "\n"));
    console.assert(aAppend.every((e) => e.wWinId == 1));
    console.assert(
      events.every((e, i) =>
        !(i % 2) ? e.aAppend === undefined : e.aAppend === 1,
      ),
      "ever odd event is a appendEvent",
    );
  }
</script>
<h1>1</h1>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-1">
  <div>
    {title}<span class="text-xs">{time}</span>
    <YouTube bind:time bind:player videoId={id} />
  </div>

  <div>
    <h3>Chapters</h3>
    {#each chapters as chapter}
      <button onclick={() => seek(chapter.start_time * 1000)}
        >{chapter.title}</button
      ><br />
    {/each}
  </div>
  <div class="h-80 overflow-y-scroll border border-gray-300 p-2">
    {#each textEvents as te}
      <TextEvent {seek} bind:time {...te} />
    {/each}
  </div>
</div>

<!-- {description} -->
