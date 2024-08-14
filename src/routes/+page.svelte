<script lang="ts">
  import { goto } from "$app/navigation";
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
  <form action="|" method="POST">
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
            <th scope="col" class="align-top"> size </th>
            <th scope="col" class="align-top"> id </th>
            <th scope="col" class="align-top"> duration </th>
          </tr>
        </thead>
        <tbody>
          {#each selected as f}
            <tr>
              <td>
                {#if f.id && !f.create}
                  <a href="movie/{f.id}">{f.filename}</a>
                {:else}
                  <a href="movie/create/{f.filename}">{f.filename}</a>
                {/if}
              </td>
              <td> {f.size} </td>
              <td>
                {#if f.id}
                  {f.id}
                  <button
                    onclick={async () => {
                      const response = await fetch("/api/deleteMovie", {
                        method: "POST",
                        body: JSON.stringify({ id: f.id }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                      });
                      if (response.ok) {
                      }
                    }}><Icon name="delete" /></button
                  >
                {/if}
              </td>
              <td class=""> {f.duration} </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </form>
</main>
