<script lang="ts">
</script>

<video autoplay width="640" height="360" controls>
  <source src="/test/opening.mkv" type="video/mp4" />
  <track default src="/test/opening.vtt" kind="captions" srclang="test" label="testlabel" />
  <track src="/test/chapters.vtt" kind="captions" srclang="de" label="chapters" />
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
