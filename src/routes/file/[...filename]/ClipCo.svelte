<script lang="ts">
  import type { Segment, Word } from "$lib/types";
  import { wordSep } from "$lib/util/alignArrays";
  //   import { wordSep } from "$lib/util/alignArrays";
  let {
    clip_id,
    words,
    segments,
  }: {
    clip_id: number;
    words: Word[];
    segments: Segment[];
  } = $props();
  const sgmtss = segments.map((s) => ({
    ...s,
    words: [...wordSep(s.text)],
  }));

  console.log(sgmtss[0]);
  //   console.log(words[0]);
</script>

Clip:{clip_id}
