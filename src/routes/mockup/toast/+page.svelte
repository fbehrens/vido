<script lang="ts">
  import Toaster from "$lib/components/Toaster.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
</script>

<Toaster />
<form method="post" class="w-1/4 flex flex-col gap-2">
  <div class="flex flex-col gap-1">
    <label for="title">Title</label>
    <input
      class="rounded-md border border-gray-800"
      id="title"
      placeholder="title"
    />
  </div>
  <div class="flex flex-col gap-1">
    <label for="message">message</label>
    <input
      class="rounded-md border border-gray-800"
      id="message"
      placeholder="message"
    />
  </div>
  <Button class="rounded-md bg-gray-300 p-1">submit</Button>
</form>
