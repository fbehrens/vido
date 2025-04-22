<script lang="ts">
  import Toaster from "$lib/components/Toaster.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { getToastState } from "$lib/toast-state.svelte";
  const toastState = getToastState();
  let title = $state("");
  let message = $state("");
  let titleInput = $state<HTMLInputElement>();
</script>

<Toaster />
<form
  onsubmit={(e) => {
    e.preventDefault();
    toastState.add(title, message);
    title = "";
    message = "";
    titleInput?.focus();
  }}
  class="w-1/4 flex flex-col gap-2"
>
  <div class="flex flex-col gap-1">
    <label for="title">Title</label>
    <input
      class="rounded-md border border-gray-800"
      id="title"
      bind:value={title}
      bind:this={titleInput}
    />
  </div>
  <div class="flex flex-col gap-1">
    <label for="message">message</label>
    <input
      class="rounded-md border border-gray-800"
      id="message"
      bind:value={message}
    />
  </div>
  <Button type="submit" class="rounded-md bg-gray-300 p-1">submit</Button>
</form>
