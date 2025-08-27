<script lang="ts">
  import { columns } from "./columns";
  import DataTable from "./data-table.svelte";
  import { getFlms } from "./data.remote";
</script>

<DataTable data={await getFlms()} {columns} />
