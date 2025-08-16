<script lang="ts">
  import { createYoutube, getYoutube as getYoutubes } from "./data.remote";
  let value = $state("o1JgW_4MTWI");
  // https://youtu.be/EbqSVYt7PxI @ WDR
  // o1JgW_4MTWI
</script>

<form
  {...createYoutube.enhance(async ({ form, data, submit }) => {
    try {
      await submit().updates(getYoutubes());
      form.reset();
    } catch (error) {
      alert("Oh no! Something went wrong");
    }
  })}
>
  <label>
    Url:<input type="text" name="url" placeholder="https://youtu.be/..." bind:value size="50" />
  </label>
  <button class="">Submit</button><br />
</form>
<div class="container">
  <div>id</div>
  <div>title</div>
  {#each await getYoutubes() as { id, title, youtubeId }}
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
