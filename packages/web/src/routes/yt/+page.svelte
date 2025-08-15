<script lang="ts">
  import { getYoutube } from "./data.remote";
  let value = $state("");
  // https://youtu.be/EbqSVYt7PxI @ WDR
  // https://youtu.be/OXGznpKZ_sA?si=xm8IitoTrgV0IYHT
</script>

<form method="POST">
  <label>
    Url:<input type="text" name="url" placeholder="https://youtu.be/..." bind:value size="50" />
  </label>
  <button class="">Submit</button><br />
</form>
<div class="container">
  <div>id</div>
  <div>title</div>
  {#each await getYoutube() as { id, title, youtubeId }}
    <div>{youtubeId}</div>
    <div><a href="yt/{id}">{title}</a></div>
  {/each}
</div>

<style>
  .container {
    display: grid;
    gap: 1px;
    grid-template-columns: 1fr 4fr;
  }
</style>
