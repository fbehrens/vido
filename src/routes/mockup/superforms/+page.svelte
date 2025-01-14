<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { superForm } from "sveltekit-superforms";
  import SuperDebug from "sveltekit-superforms";

  let { data } = $props();
  const { form } = superForm(data.form);
</script>

<SuperDebug data={$form} />

<form method="POST" class="w-1/4 flex flex-col gap-2">
  <div class="flex flex-col gap-1">
    <label for="name">name</label>
    <input
      type="text"
      class="rounded-md border border-gray-800"
      name="name"
      bind:value={$form.name}
    />
  </div>
  <div class="flex flex-col gap-1">
    <label for="email">email</label>
    <input
      type="text"
      class="rounded-md border border-gray-800"
      name="email"
      bind:value={$form.email}
    />
  </div>
  <Button type="submit" class="rounded-md bg-gray-300 p-1">submit</Button>
</form>
