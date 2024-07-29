<script lang="ts">
  import YouTube from "$lib/components/YouTube.svelte";

  let { data } = $props();
  let { description, duration, id, info, title, chapters } = data;
  console.log(chapters[0]);
  let player = $state<YT.Player>();
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
