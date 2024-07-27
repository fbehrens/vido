<script>
  let paused = $state(true);
  let video;
  function toggle() {
    console.log(video);
    if (paused) video.play();
    else video.pause();
  }
</script>

paused={paused}
<!-- <button onclick={() => video.play()}>play</button>
<button onclick={() => video.pause()}>pause</button> -->
<button onclick={toggle}>toggle</button>

<div>
  <video
    bind:this={video}
    poster="https://sveltejs.github.io/assets/caminandes-llamigos.jpg"
    src="https://sveltejs.github.io/assets/caminandes-llamigos.mp4"
    bind:paused
    onclick={toggle}
    muted={true}
  >
    <track kind="captions" />
  </video>
</div>
