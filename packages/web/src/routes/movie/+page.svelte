<script lang="ts">
  import { Trash2, Scissors, Plus } from "lucide-svelte/icons";
  let { data } = $props();
  let { mvs } = data;
  console.log(mvs[0]);
  let searchString = $state("");
  let selected = $derived(
    mvs.filter((e: any) =>
      e.title.toLowerCase().includes(searchString.toLowerCase()),
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
          <th scope="col" class="align-top"> id </th>
          <th scope="col" class="align-top"> min </th>
          <th scope="col" class="align-top"> clips </th>
        </tr>
      </thead>
      <tbody>
        {#each selected as f}
          <tr>
            <td>
              <a href="movie/{f.id}">{f.title}</a>
            </td>
            <td>
              <form method="POST" class="flex">
                <input name="id" hidden={true} value={f.id} />
                {f.id}
                <button type="submit" formaction="?/delete">
                  <Trash2 class="size-4" />
                </button>
                <a href="movie/cut/{f.id}"> <Scissors class="size-4" /> </a>
              </form></td
            >
            <td>
              {Math.round(f.duration / 6) / 10}
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
