<script lang="ts">
  export let data;
  let fltr = "";
  $: filtrd = data.files.filter((e) => e.filename.includes(fltr));
  //   console.log(data)
</script>

<main>
  <div class="flex w-full">
    <div class="bg-gray-200 p-2 flex-grow">
      Filename:<br />
      <input class="w-full" bind:value={fltr} />
    </div>
    <div class="bg-white p-2 w-32">Size</div>
  </div>

  {#each filtrd as row}
    <div class="flex w-full">
      <div class:is-vdo={row.isVdo} class="bg-gray-200 p-2 flex-grow">
        <a href="file/{row.filename}">{row.filename}</a>
      </div>
      <div class="bg-white p-2 w-32">{row.size}</div>
    </div>
  {/each}
</main>

<style>
  .is-vdo {
    color: red;
  }
</style>
