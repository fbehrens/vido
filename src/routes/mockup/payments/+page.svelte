<script lang="ts">
  import DataTable from "./data-table.svelte";
  import { columns } from "./columns";
  let { data } = $props();
  let payments = $derived(data.payments);
</script>

<DataTable data={payments} {columns} />
