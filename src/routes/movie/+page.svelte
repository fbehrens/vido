<script lang="ts">
  import Icon from "$lib/components/Icon.svelte";
  let { data } = $props();
  let { files } = data;
  let searchString = $state("");
  let selected = $derived(
    files.filter((e: any) =>
      e.filename.toLowerCase().includes(searchString.toLowerCase()),
    ),
  );
</script>

<main>
  <div class="relative overflow-x-auto">
    <table class="table-auto">
      <thead class="">
        <tr>
          <th scope="col" class="">
            Filename <br /><input
              class="w-full"
              bind:value={searchString}
            /></th
          >
          <th scope="col" class="align-top"> MB </th>
          <th scope="col" class="align-top"> id </th>
          <th scope="col" class="align-top"> min </th>
          <th scope="col" class="align-top"> clips </th>
        </tr>
      </thead>
      <tbody>
        {#each selected as f}
          <tr>
            <td>
              {#if f.id }
                <a href="movie/{f.id}">{f.filename}</a>
              {:else}
                {f.filename}
              {/if}
            </td>
            <td> {Math.round(f.size / 1_000_000)} </td>
            <td>
              <form method="POST" class="flex">
                <input name="filename" hidden={true} value={f.filename} />
                <input name="id" hidden={true} value={f.id} />
                {#if f.id}
                  {f.id}
                  <button type="submit" formaction="?/delete">
                    <Icon name="delete" />
                  </button>
                {/if}
                {#if f.id && !f.has_segments && f.everyClipHasSegments}
                  <a href="movie/cut/{f.id}"> <Icon name="cut" /> </a>
                {/if}
                {#if !f.id || (!f.has_segments && !f.everyClipHasSegments)}
                  <button type="submit" formaction="?/create"
                    ><Icon name="create" /></button
                  >
                {/if}
              </form>
            </td>
            <td>
              {#if f.duration}{Math.round(f.duration / 6) / 10}
              {/if}
            </td>
            <td
              >{#each f.captions as c}
                {c.typ}&nbsp;
              {/each}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</main>
