<script lang="ts">
  import { columns } from "./columns";
  import DataTable from "./data-table.svelte";

  const { data } = $props();
  const { files } = data;
</script>

<DataTable data={files} {columns} />
