<script>
  //https://stackoverflow.com/questions/76690112/how-to-use-youtube-embed-api-in-svelte

  let {
    player = $bindable(),
    time = $bindable(),
    videoId,
    height = "390",
    width = "640",
    playerId = "youtube-player",
  } = $props();

  let intervallId = $state(0);

  function load() {
    player = new YT.Player(playerId, {
      playerVars: { autoplay: 1 },
      events: {
        onReady: () => {
          intervallId = setInterval(() => {
            time = player.getCurrentTime();
          }, 100);
        },
      },
    });
  }

  $effect(() => {
    if (window.YT) {
      load();
    } else {
      window.onYouTubeIframeAPIReady = load;
    }
    return () => {
      if (intervallId) {
        clearInterval(intervallId);
      }
    };
  });
</script>

<svelte:head>
  <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<!-- svelte-ignore a11y_missing_attribute -->
<iframe
  id={playerId}
  type="text/html"
  {width}
  {height}
  src="http://www.youtube.com/embed/{videoId}?enablejsapi=1"
  frameborder="0"
></iframe>
