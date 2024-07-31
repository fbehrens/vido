<script lang="ts">
  import YouTube from "$lib/components/YouTube.svelte";
  import type { Json3Event } from "$lib/types.js";

  let { data } = $props();
  let { description, duration, id, info, title, chapters, json3text } = data;
  const events = JSON.parse(json3text).events as Json3Event[];
  let player = $state<YT.Player>();
  console.log(events.slice(0, 4));
</script>

<!-- <svelte:head>
  <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head> -->

<h2>{title}</h2>
<YouTube bind:player videoId={id} />
{#each chapters as chapter}
  <button onclick={() => player.seekTo(chapter.start_time)}
    >{chapter.title}</button
  ><br />
{/each}
<!-- {description} -->
