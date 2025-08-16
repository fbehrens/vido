<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { columns } from "./columns";
  import DataTable from "./data-table.svelte";
  import { getFiles, insertMovies } from "./data.remote";
</script>

<div>
  <Button
    class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    onclick={async () => {
      try {
        await insertMovies();
      } catch (error) {
        alert("Something went wrong!");
      }
    }}>insert movies</Button
  >
</div>
<DataTable data={await getFiles()} {columns} />
