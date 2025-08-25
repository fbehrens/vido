<script lang="ts">
  import Select from "$lib/components/Select.svelte";
  import type { SelectOption } from "$lib/components/Select.svelte";

  let selectedValue: string | null = null;

  const options: SelectOption[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];
</script>

select
