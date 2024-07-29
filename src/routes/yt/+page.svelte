<script lang="ts">
  let { data } = $props();
  let { now, yts } = data;
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
    <h2>{yt.id} {yt.title}</h2>
  {/each}
</div>
served at {now}
