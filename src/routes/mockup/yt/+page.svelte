<svelte:options runes={true} />

<script>
  import YouTube from "$lib/components/YouTube.svelte";

  const options = {
    height: "390",
    width: "640",
    //  see https://developers.google.com/youtube/player_parameters
    playerVars: {
      autoplay: 0,
    },
  };

  function onReady(event) {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
    yt = event.detail.target;
  }
  let yt;
</script>

<button
  onclick={() => {
    console.log(yt);
    yt.seekTo(100, true);
  }}
>
  100</button
>
<YouTube videoId="OXGznpKZ_sA" {options} on:ready={onReady} />
