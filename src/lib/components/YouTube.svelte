<script>
  //https://stackoverflow.com/questions/76690112/how-to-use-youtube-embed-api-in-svelte
  import { onMount } from "svelte";

  export let player;
  export let initialVideoId = "";

  const ytPlayerId = "youtube-player";

  onMount(() => {
    function load() {
      player = new YT.Player(ytPlayerId, {
        height: "390", // "100%",
        width: "640", //"100%",
        videoId: initialVideoId,
        playerVars: { autoplay: 1 },
      });
    }

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

<div id={ytPlayerId}></div>
