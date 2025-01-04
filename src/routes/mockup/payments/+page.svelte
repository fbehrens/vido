<script lang="ts">
 import DataTable from "$lib/components/ui/data-table.svelte";
 import { columns } from "./columns";

 let { data } = $props();
 let {payments} = data
</script>

<DataTable data={payments} {columns} />