<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  let { id }: { id: string } = $props();
  const handleSubmit = async (action: string) => {
    const f = new FormData();
    f.append("id", id);
    f.append("action", action);
    try {
      const response = await fetch("?", {
        method: "POST",
        body: f,
        headers: {
          accept: "application/json",
        },
      });
      await invalidateAll();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="icon"
        class="relative size-8 p-0"
      >
        <span class="sr-only">Open menu</span>
        <Ellipsis class="size-4" />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
      <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
        Copy payment ID
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>View customer</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => handleSubmit("drink")}
      >drink</DropdownMenu.Item
    >
    <DropdownMenu.Item onclick={() => handleSubmit("cook")}
      >cook</DropdownMenu.Item
    >
  </DropdownMenu.Content>
</DropdownMenu.Root>
