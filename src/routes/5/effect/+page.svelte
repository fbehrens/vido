<script lang="ts">
  let size = $state(50);
  let color = $state("#ff3e00");
  let canvas: HTMLCanvasElement;
  const interval = setInterval(() => {
    console.log(size);
    size += 10;
  }, 1000);

  $effect(() => {
    const context = canvas.getContext("2d")!;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // this will re-run whenever `color` or `size` change
    context.fillStyle = color;
    context.fillRect(0, 0, size, size);
  });
</script>

<canvas bind:this={canvas} width="1000" height="1000"></canvas>
