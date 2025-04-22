<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { superForm } from "sveltekit-superforms";
  import SuperDebug from "sveltekit-superforms";

  let { data } = $props();
  const { form, errors, constraints, message } = superForm(data.form);
  console.log({ $errors, $constraints, $message });
</script>

<!-- <SuperDebug data={$form} /> -->

{#if $message}<h3>{$message}</h3>{/if}

<form method="POST" class="w-1/4 flex flex-col gap-2">
  <div class="flex flex-col gap-1">
    <label for="name">name</label>
    <input
      type="text"
      class="rounded-md border border-gray-800"
      name="name"
      bind:value={$form.name}
      {...$constraints.name}
    />
    {#if $errors.name}<span class="bg-red-500">{$errors.name}</span>{/if}
  </div>

  <div class="flex flex-col gap-1">
    <label for="email">email</label>
    <input
      type="text"
      class="rounded-md border border-gray-800"
      name="email"
      bind:value={$form.email}
      {...$constraints.email}
    />
    {#if $errors.email}<span class="bg-red-500">{$errors.email}</span>{/if}
  </div>
  <Button type="submit" class="rounded-md bg-gray-300 p-1">submit</Button>
</form>
