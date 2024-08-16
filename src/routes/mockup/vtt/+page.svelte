<script lang="ts">
  let src = "/mov/zoom/24-07-03";
</script>

<video width="640" height="360" controls>
  <source src="{src}.mp4" type="video/mp4" />
  <track
    src="{src}.test.vtt"
    kind="captions"
    srclang="test"
    label="testlabel"
  />
  <track src="{src}.vtt" kind="subtitles" srclang="de" label="Deutsch" />
</video>

<style>
  ::cue(v[voice="Test"]) {
    color: #fff;
    background: #0095dd;
    outline: solid;
  }
  ::cue(v[voice="Frank"]) {
    color: #0f0;
    background: #000;
  }
</style>
