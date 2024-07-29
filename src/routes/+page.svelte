<script lang="ts">
  let { data } = $props();
  let { files } = data;
  let fltr = $state("");
  let filtrd = $derived(files.filter((e: any) => e.filename.includes(fltr)));
</script>

<main>
  <div class="relative overflow-x-auto">
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">
            Filename <br /><input class="w-full" bind:value={fltr} /></th
          >
          <th scope="col" class="px-6 py-3"> size </th>
          <th scope="col" class="px-6 py-3"> id </th>
          <th scope="col" class="px-6 py-3"> duration </th>
        </tr>
      </thead>
      <tbody>
        {#each filtrd as f}
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th
              scope="row"
              class:is-vdo={f.isVdo}
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <a href="file/{f.filename}?id={f.id}">{f.filename}</a>
            </th>
            <td class="px-6 py-4"> {f.size} </td>
            <td class="px-6 py-4"> {f.id} </td>
            <td class="px-6 py-4"> {f.duration} </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</main>

<style>
  .is-vdo {
    color: yellow;
  }
</style>
