<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Input from "$lib/components/ui/input/input.svelte";
  import { columns } from "./columns";
  import DataTable from "./data-table.svelte";
  import { getFlms } from "./data.remote";
  let search = $state("lanz");
  let limit = $state("1000");
  const param = $derived({ search, limit: Number(limit) });
  const data = $derived(await getFlms(param));
</script>

<div class="flex flex-row">
  <Input placeholder={"Filter ..."} bind:value={search} class="max-w-sm" />
  <div class="flex items-center gap-2 text-gray-400">
    <span class="text-sm">(</span>
    <Input bind:value={limit} class="w-20 " />
    <span class="text-sm">/222)</span>
  </div>
  <Button onclick={() => getFlms(param).refresh()} variant="outline">refresh</Button>
</div>

<DataTable {data} {columns} />
