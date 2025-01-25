<script lang="ts">
  import { columns } from "./columns";
  import DataTable from "./data-table.svelte";

  const { data } = $props();
  const { files } = data;
  console.log(files);
</script>

<DataTable data={files} {columns} />
