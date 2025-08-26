<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import type { Files } from "./data.remote";
  import { type Column } from "@tanstack/table-core";

  const { column }: { column: Column<Files, unknown> } = $props(); // Column<Files, unknown>;
</script>

<div class="flex flex-col items-start">
  <div>filename</div>
  <Input
    placeholder="Filter filename..."
    value={(column.getFilterValue() as string) ?? ""}
    oninput={(e) => {
      column.setFilterValue(e.currentTarget.value);
    }}
    class="max-w-sm"
  />
</div>
