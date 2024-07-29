<script lang="ts">
  let { data } = $props();
  let { yts } = data;
  let value = $state("");
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
  <button type="submit">Submit</button><br />
</form>
<div>
  {#each yts as yt}
    <a href="yt/{yt.id}">{yt.title}</a>
  {/each}
</div>
