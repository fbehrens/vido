<script lang="ts">
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
  <button
    class="p-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
    >Submit</button
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
