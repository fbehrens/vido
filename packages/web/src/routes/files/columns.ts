import { renderComponent } from "$lib/components/ui/data-table/render-helpers";
import type { ColumnDef } from "@tanstack/table-core";
import type { Files } from "./data.remote";
import FilenameHeader from "./FilenameHeader.svelte";

import { formatDuration, formatSize } from "$lib/helper";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Files>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "filename",
    header: ({ column }) => renderComponent(FilenameHeader, { column }),
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
