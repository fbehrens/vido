<script lang="ts">
  import Toast from "./Toast.svelte";

  const toast = {
    id: crypto.randomUUID(),
    title: "Toast Title",
    message: "Toast Message",
  };
</script>

<div class="absolute right-2 top-2 flex flex-col gap-2">
  <Toast {toast} />
</div>
