<script lang="ts">
  import Ttml from "$lib/components/Ttml.svelte";

  const { data } = $props();
  const { film, captions } = data;
  console.log({ film, captions });
</script>

<Ttml srcVideo={film.url} srcTtml={film.captions} />
