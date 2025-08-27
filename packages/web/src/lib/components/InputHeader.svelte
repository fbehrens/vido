<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { type Column } from "@tanstack/table-core";
  import type { Files } from "../../routes/files/data.remote";
  import type { Flm } from "../../routes/mediathek/data.remote";
  type InputHeaderProps<T> = {
    column: Column<T, unknown>;
    a_key: string;
  };

  const { column, a_key }: InputHeaderProps<any> = $props();
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
