import { renderComponent } from "$lib/components/ui/data-table/render-helpers";
import type { ColumnDef } from "@tanstack/table-core";
import type { Film } from "./data.remote";
import FilteredColumnHeader from "$lib/components/FilteredColumnHeader.svelte";
import { Checkbox } from "$lib/components/ui/checkbox/index.js";

export const columns: ColumnDef<Film>[] = [
  {
    id: "select",
    header: ({ table }) =>
      renderComponent(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all",
      }),
    cell: ({ row }) =>
      renderComponent(Checkbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (value) => row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "sender",
    header: ({ column }) => renderComponent(FilteredColumnHeader, { column }),
  },
  {
    accessorKey: "thema",
    header: ({ column }) => renderComponent(FilteredColumnHeader, { column }),
  },
  {
    accessorKey: "titel",
    header: ({ column }) => renderComponent(FilteredColumnHeader, { column }),
    filterFn: "includesString", //Sensitive
  },
  {
    accessorKey: "datum",
    header: ({ column }) => renderComponent(FilteredColumnHeader, { column }),
  },
  {
    accessorKey: "beschreibung",
    header: ({ column }) => renderComponent(FilteredColumnHeader, { column }),
  },
];
