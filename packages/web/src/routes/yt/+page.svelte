<script lang="ts">
    import {Button} from '$lib/components/ui/button'
  let { data } = $props();
  let { yts } = data;
  let value = $state("");
  // https://youtu.be/EbqSVYt7PxI @ WDR
  // https://youtu.be/OXGznpKZ_sA?si=xm8IitoTrgV0IYHT
</script>

<form method="POST">
  <label>
    Url:<input
      type="text"
      name="url"
      placeholder="https://youtu.be/..."
      bind:value
      size="50"
    />
  </label>
  <Button
    class=""
    >Submit</Button
  ><br />
</form>
<div class="container">
  <div>id</div>
  <div>title</div>
  {#each yts as yt}
    <div>{yt.youtubeId}</div>
    <div><a href="yt/{yt.id}">{yt.title}</a></div>
  {/each}
</div>

<style>
  .container {
    display: grid;
    gap: 1px;
    grid-template-columns: 1fr 4fr;
  }
</style>
