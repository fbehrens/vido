<script lang="ts">
  import type { Word } from "$lib/types";
  export let words: Word[];
</script>

<table class="border-collapse text-xs">
  {#each words as w}
    <tr class="bg-gray-100">
      <td class="border border-gray-300">{w.start}</td>
      <td class="border border-gray-300">{w.end}</td>
      <td class="border border-gray-300">{w.word}</td>
    </tr>
  {/each}
</table>
