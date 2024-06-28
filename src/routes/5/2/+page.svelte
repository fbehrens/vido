<script>
  let width = $state(1);
  let height = $state(2);

  let area = $derived(width * height);

  $effect(() => {
    console.log(area);
  });
</script>

<p>
  <button onclick={() => (width = width + 1)}> width={width} </button>
</p>
<p>
  <button onclick={() => (height = height + 1)}> height={height} </button>
</p>
<p>
  area={area}
</p>
