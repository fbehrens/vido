<script lang="ts">
  import { enhance } from "$app/forms";
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
  function handleSubmit(filename: string) {
    return (e: MouseEvent) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("filename", filename);
      fetch("?/insert", {
        method: "POST",
        body: formData,
      });
    };
  }
</script>

<main>
  <form
    method="POST"
    use:enhance={() => {
      console.log(1);
      return async (result) => {
        // `result` is an `ActionResult` object
        console.log({ result });
        // if (result.type === 'redirect') {
        // 	goto(result.location);
        // } else {
        // 	await applyAction(result);
        // }
      };
    }}
  >
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
            <th scope="col" class="align-top"> clips </th>
          </tr>
        </thead>
        <tbody>
          {#each selected as f}
            <tr>
              <td>
                {#if f.id && f.has_segments}
                  <a href="movie/{f.id}">{f.filename}</a>
                {:else}
                  <a href="movie/create/{f.filename}">{f.filename}</a>
                  <button onclick={handleSubmit(f.filename)}>insert</button>
                {/if}
              </td>
              <td> {f.size} </td>
              <td>
                {#if f.id}
                  {f.id}
                  <button
                    onclick={async (e: MouseEvent) => {
                      e.preventDefault();
                      const response = await fetch("/api/deleteMovie", {
                        method: "POST",
                        body: JSON.stringify({ id: f.id }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                      });
                      if (response.ok) {
                        console.log(await response.body);
                        goto("/");
                      }
                    }}
                  >
                    <Icon name="delete" />
                  </button>
                {/if}
              </td>
              <td class=""> {f.duration} </td>
              <td
                >{#each f.clips as c}
                  <a href="/movie/{f.id}/{c.id}">{c.id}</a>&nbsp;
                {/each}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </form>
</main>
