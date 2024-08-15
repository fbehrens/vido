<script lang="ts">
  const { id, clip_id }: { id: number; clip_id?: number } = $props();
</script>

download srt
<a href="/api/srt?id={id}&clip_id={clip_id}&unit=word">word</a>&nbsp;<a
  href="/api/srt?id={id}&clip_id={clip_id}&unit=segment">segment</a
>
