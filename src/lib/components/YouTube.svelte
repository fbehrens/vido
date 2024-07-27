<script>
  //https://stackoverflow.com/questions/76690112/how-to-use-youtube-embed-api-in-svelte

  let {
    player = $bindable(),
    videoId,
    height = "390",
    width = "640",
    playerId = "youtube-player",
  } = $props();

  function load() {
    player = new YT.Player(playerId, {
      height, // "100%",
      width, //"100%",
      videoId,
      playerVars: { autoplay: 1 },
    });
  }

  $effect(() => {
    if (window.YT) {
      load();
    } else {
      window.onYouTubeIframeAPIReady = load;
    }
  });
</script>

<svelte:head>
  <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<div id={playerId}></div>
