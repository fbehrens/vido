<script lang="ts">
  import { getToastState } from "$lib/toast-state.svelte";
  import type { Toast } from "$lib/types";
  import { CircleX } from "lucide-svelte/icons";
  type Props = { toast: Toast };
  let { toast }: Props = $props();
  const toastState = getToastState();
</script>

<div
  class="relative flex h-16 w-60 flex-col justify-center rounded-md border border-gray-500 bg-gray-300 p-2 shadow-md"
>
  <span class="text-sm font-medium">{toast.title}</span>
  <span class="text-xs">{toast.message}</span>
  <button
    class="absolute right-2 top-2 size-5"
    onclick={() => {
      toastState.remove(toast.id);
    }}
  >
    <span class="sr-only">Close toast</span>
    <CircleX />
  </button>
</div>
