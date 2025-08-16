// import { renderComponent, renderSnippet } from "$lib/components/ui/data-table";
import type { ColumnDef } from "@tanstack/table-core";
// import { createRawSnippet } from "svelte";
// import DataTableActions from "./data-table-actions.svelte";
// import DataTableEmailButton from "./data-table-email-button.svelte";
// import { Checkbox } from "$lib/components/ui/checkbox/index.js";
import type { MyFile } from "./data.remote";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<MyFile>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "filename",
    header: "filename",
  },
  {
    accessorKey: "size",
    header: "size",
  },
];
