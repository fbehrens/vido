import { renderComponent } from "$lib/components/ui/data-table/render-helpers";
import type { ColumnDef } from "@tanstack/table-core";
import type { Flm } from "./data.remote";
import InputHeader from "$lib/components/InputHeader.svelte";
import { Checkbox } from "$lib/components/ui/checkbox/index.js";

export const columns: ColumnDef<Flm>[] = [
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
    header: "sender",
  },
  {
    accessorKey: "thema",
    header: "thema",
  },
  {
    accessorKey: "titel",
    header: ({ column }) => renderComponent(InputHeader, { column, a_key: "titel" }),
  },
  {
    accessorKey: "datum",
    header: "datum",
  },
];
