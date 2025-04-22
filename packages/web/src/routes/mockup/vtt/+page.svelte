<script lang="ts">
</script>

<video autoplay width="640" height="360" controls>
  <source src="/mov/test.mov" type="video/mp4" />
  <track
    default
    src="/mov/test.vtt"
    kind="captions"
    srclang="test"
    label="testlabel"
  />
  <track
    src="/mov/chapters.vtt"
    kind="captions"
    srclang="de"
    label="chapters"
  />
</video>

<style>
  ::cue {
  }
  ::cue(v[voice="Test"]) {
    font-size: 0.5em;
    color: #fff;
    background: #0095dd;
    outline: solid;
  }
  ::cue(v[voice="Frank"]) {
    color: #0f0;
    background: #000;
  }
</style>
