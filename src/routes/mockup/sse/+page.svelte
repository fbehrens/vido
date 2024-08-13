<script lang="ts">
  let datas: string[] = $state([]);

  function subscribe() {
    const sse = new EventSource("/mockup/sse");
    sse.onmessage = (e) => {
      datas.push(e.data as string);
    };
    return () => sse.close();
  }
  $effect(() => {
    return subscribe();
  });
</script>

{#each datas as data}
  <pre>{data}</pre>
{/each}
