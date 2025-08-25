// import { renderComponent, renderSnippet } from "$lib/components/ui/data-table";
import type { ColumnDef } from "@tanstack/table-core";
// import { createRawSnippet } from "svelte";
// import DataTableActions from "./data-table-actions.svelte";
// import DataTableEmailButton from "./data-table-email-button.svelte";
// import { Checkbox } from "$lib/components/ui/checkbox/index.js";
import type { Files } from "./data.remote";

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
    header: "filename",
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
