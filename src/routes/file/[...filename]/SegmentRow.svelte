<script lang="ts">
  import type { Word } from "$lib/types";
  //   import WordsTable from "$lib/components/WordsTable.svelte";
  import Icon from "$lib/components/Icon.svelte";

  let {
    clip_id,
    time = $bindable(),
    id,
    start,
    end,
    text,
    setTime,
    apiDeleteSegment,
  }: {
    clip_id: number;
    time: number;
    id: number;
    start: number;
    end: number;
    text: string;
    setTime: any;
    apiDeleteSegment: any;
  } = $props();

  let isCurrent = $derived(time >= start && time <= end);
</script>

<div class="flex">
  <div class="w-[10ch]">
    <button onclick={() => apiDeleteSegment({ id })}>
      <Icon name="delete" />
    </button>
    {clip_id}
  </div>
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <button class="w-[7ch]" onclick={() => setTime({ time: start })}>
    {start.toFixed(2)}
  </button>
  <div class="w-[7ch]">{end.toFixed(2)}</div>
  <div class="flex-1 {isCurrent ? 'bg-green-200' : ''}">
    {text}
  </div>
</div>
