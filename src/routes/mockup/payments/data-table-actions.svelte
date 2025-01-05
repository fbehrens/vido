<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  let { id }: { id: string } = $props();
  const handleSubmit = async () => {
    const f = new FormData();
    f.append("id", "25");
    try {
      const response = await fetch("?/foo", {
        method: "POST",
        body: f,
        headers: {
          accept: "application/json",
        },
      });
      const json = await response.json();
      console.log({ json });
      if (response.ok) {
        await invalidateAll();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
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
    <DropdownMenu.Item>View payment details</DropdownMenu.Item>
    <DropdownMenu.Item onclick={handleSubmit}>submit</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
