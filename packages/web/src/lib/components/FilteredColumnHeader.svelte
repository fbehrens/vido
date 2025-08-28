<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { type Column } from "@tanstack/table-core";
  type InputHeaderProps<T> = {
    column: Column<T, unknown>;
    label?: string;
  };
  const { column, label }: InputHeaderProps<any> = $props();
  const label_ = label ?? column.id;
</script>

<div class="flex flex-col items-start">
  <div>{label_}</div>
  <Input
    placeholder={"Filter " + label_ + "..."}
    value={(column.getFilterValue() as string) ?? ""}
    oninput={(e) => {
      column.setFilterValue(e.currentTarget.value);
    }}
    class="max-w-sm"
  />
</div>
