import { renderComponent, renderSnippet } from "$lib/components/ui/data-table/render-helpers";
import type { ColumnDef } from "@tanstack/table-core";
import type { File } from "./data.remote";
import FilteredColumnHeader from "$lib/components/FilteredColumnHeader.svelte";
import { Checkbox } from "$lib/components/ui/checkbox/index.js";

import { formatDuration, formatSize } from "$lib/helper";
import { createRawSnippet } from "svelte";

export const columns: ColumnDef<File>[] = [
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
    header: ({ column }) => renderComponent(FilteredColumnHeader, { column }),
    cell: ({ row }) => {
      const filenameLinkSnippet = createRawSnippet(() => ({
        render: () => `<a href="/movie/${row.getValue("id")}">${row.getValue("filename")}</a>`,
      }));
      return renderSnippet(filenameLinkSnippet, "");
    },
  },
  {
    accessorKey: "subtitles",
    header: ({ column }) => renderComponent(FilteredColumnHeader, { column }),
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
