<script lang="ts">
  import Pump from "./Pump.svelte";

  let size = $state(15);
  let burst = $state(false);

  function reset() {
    size = 15;
    burst = false;
  }
</script>

<Pump
  inflate={(power) => {
    size += power;
    if (size > 75) burst = true;
  }}
  deflate={(power) => {
    if (size > 0) size -= power;
  }}
/>

{#if burst}
  <button onclick={reset}>new balloon</button>
  <span class="boom">💥</span>
{:else}
  <span class="balloon" style="scale: {0.01 * size}"> 🎈 </span>
{/if}

<style>
  span {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: 100vw;
    text-align: center;
    line-height: 1;
    pointer-events: none;
  }

  .balloon {
    transition: scale 0.2s;
  }

  .boom {
    animation: boom 0.5s forwards;
  }

  @keyframes boom {
    0% {
      scale: 0.6;
    }
    25% {
      scale: 0.75;
    }
    100% {
      scale: 0;
    }
  }
</style>
