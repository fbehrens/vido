<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import type { Files } from "../../routes/files/data.remote";
  import { type Column } from "@tanstack/table-core";

  const { column, a_key }: { column: Column<Files, unknown>; a_key: string } = $props(); // Column<Files, unknown>;
</script>

<div class="flex flex-col items-start">
  <div>{a_key}</div>
  <Input
    placeholder={"Filter " + a_key + "..."}
    value={(column.getFilterValue() as string) ?? ""}
    oninput={(e) => {
      column.setFilterValue(e.currentTarget.value);
    }}
    class="max-w-sm"
  />
</div>
