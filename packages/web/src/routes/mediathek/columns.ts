import { renderComponent, renderSnippet } from "$lib/components/ui/data-table/render-helpers";
import type { ColumnDef, Row } from "@tanstack/table-core";
import type { FilmDuck } from "./data.remote";
import FilteredColumnHeader from "$lib/components/FilteredColumnHeader.svelte";
import { Checkbox } from "$lib/components/ui/checkbox/index.js";
import { createRawSnippet } from "svelte";

const titelSnippet = createRawSnippet<[Row<FilmDuck>]>((o) => ({
  render: () => `<a href="/mediathek/${o().getValue("id")}" >${o().getValue("titel")}</a>`,
}));

export const columns: ColumnDef<FilmDuck>[] = [
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
    cell: ({ row }) => renderSnippet(titelSnippet, row),
  },
  {
    accessorKey: "datumzeit",
    header: ({ column }) => renderComponent(FilteredColumnHeader, { column }),
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toISOString().slice(0, 16).replace("T", " ");
    },
  },
  {
    accessorKey: "beschreibung",
    header: ({ column }) => renderComponent(FilteredColumnHeader, { column }),
  },
];
