<script lang="ts">
  import { columns } from "./columns";
  import DataTable from "./data-table.svelte";
  import { getFiles } from "./data.remote";
</script>

<DataTable data={await getFiles()} {columns} />
