<script lang="ts">
  import { onMount } from "svelte";

  let datas: string[] = $state([]);

  function subscribe() {
    const sse = new EventSource("/mockup/sse1");
    sse.onmessage = (e) => {
      datas.push(e.data as string);
    };
    return () => sse.close();
  }
  $effect(() => {
    return subscribe();
  });
  onMount(() => {
    const csrfToken = document.cookie;
    //   .split("; ")
    //   .find((row) => row.startsWith("XSRF-TOKEN="))
    //   ?.split("=")[1];
    console.log({ csrfToken });
  });
</script>

{#each datas as data}
  <pre class="text-xs">{data}</pre>
{/each}
