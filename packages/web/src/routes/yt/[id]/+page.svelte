<script lang="ts">
  import TextEvent from "$lib/components/TextEvent.svelte";
  import YouTube from "$lib/components/YouTube.svelte";
  console.log('page')
  let { data } = $props();
  let time = $state(0);
  let player = $state<YT.Player>();
  let { movie, ytInfo, json3 } = data;

  const [e1, ...events] = json3 ? json3.events : [];
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
  const languagesDisplay=Object.keys(ytInfo?.automatic_captions||{}).filter((e)=> e.includes('en') || e.includes('de') || e.includes('orig') )
</script>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-1">
  <div>
    @{ytInfo?.channel} <b>/</b>
    {movie!.title}
    <span class="text-xs">
        <br>{ytInfo?.description}
        <br/>time:{time}
        <br/>language:{ytInfo!.language}
        <br/>languags:{ languagesDisplay}
    </span>
    <YouTube bind:time bind:player videoId={movie!.youtubeId} />
  </div>

  <div>
    <h3>Chapters</h3>
    {#each ytInfo!.chapters as chapter}
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
