import { renderComponent } from "$lib/components/ui/data-table/render-helpers";
import type { ColumnDef } from "@tanstack/table-core";
import type { Files } from "./data.remote";
import InputHeader from "$lib/components/InputHeader.svelte";
import { Checkbox } from "$lib/components/ui/checkbox/index.js";

import { formatDuration, formatSize } from "$lib/helper";

export const columns: ColumnDef<Files>[] = [
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
    accessorKey: "filename",
    header: ({ column }) => renderComponent(InputHeader, { column, a_key: "filename" }),
  },
  {
    accessorKey: "title",
    header: "title",
  },
  {
    accessorKey: "size",
    header: "size",
    cell: ({ getValue }) => formatSize(getValue() as number),
  },
  {
    accessorKey: "duration",
    header: "duration",
    cell: ({ getValue }) => formatDuration(getValue() as number),
  },
  {
    accessorKey: "framerate",
    header: "framerate",
  },
  {
    accessorKey: "created_at",
    header: "created_at",
  },
];
