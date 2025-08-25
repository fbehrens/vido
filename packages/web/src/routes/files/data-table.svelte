<script lang="ts" generics="TData, TValue">
  import {
    type ColumnDef,
    type ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
  } from "@tanstack/table-core";
  import { createSvelteTable, FlexRender } from "$lib/components/ui/data-table/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Input } from "$lib/components/ui/input";

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
  };

  let { data, columns }: DataTableProps<TData, TValue> = $props();
  let columnFilters = $state<ColumnFiltersState>([]);
  const table = createSvelteTable({
    get data() {
      return data;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: (updater) => {
      if (typeof updater === "function") {
        columnFilters = updater(columnFilters);
      } else {
        columnFilters = updater;
      }
    },
    state: {
      get columnFilters() {
        return columnFilters;
      },
    },
  });
</script>

<div class="flex flex-col items-start">
  <Input
    placeholder="Filter filename..."
    value={(table.getColumn("filename")?.getFilterValue() as string) ?? ""}
    onchange={(e) => {
      table.getColumn("filename")?.setFilterValue(e.currentTarget.value);
    }}
    oninput={(e) => {
      table.getColumn("filename")?.setFilterValue(e.currentTarget.value);
    }}
    class="max-w-sm"
  />
</div>

<div class="rounded-md border">
  <Table.Root>
    <Table.Header>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <Table.Row>
          {#each headerGroup.headers as header (header.id)}
            <Table.Head colspan={header.colSpan}>
              {#if !header.isPlaceholder}
                <FlexRender
                  content={header.column.columnDef.header!}
                  context={header.getContext()}
                />
              {/if}
            </Table.Head>
          {/each}
        </Table.Row>
      {/each}
    </Table.Header>
    <Table.Body>
      {#each table.getRowModel().rows as row (row.id)}
        <Table.Row data-state={row.getIsSelected() && "selected"}>
          {#each row.getVisibleCells() as cell (cell.id)}
            <Table.Cell>
              <FlexRender content={cell.column.columnDef.cell!} context={cell.getContext()} />
            </Table.Cell>
          {/each}
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
