<script>
  import { onMount } from "svelte";
  let { srcVideo, srcTtml } = $props();
  let imsc;
  let myVideo;
  let renderDiv;
  function clearSubFromScreen() {
    const subtitleActive = renderDiv.getElementsByTagName("div")[0];
    if (subtitleActive) {
      renderDiv.removeChild(subtitleActive);
    }
  }
  async function videoReady(e) {
    console.log({ videoReady: myVideo.duration });
    try {
      // need readable-sream and alias in vite config
      imsc = await import("imsc");
    } catch (e) {
      console.error("Error load imsc", e);
    }
    const myTrack = myVideo.textTracks[0];
    myTrack.mode = "hidden";
    const response = await fetch(srcTtml);
    const text = await response.text();
    const imscDoc = imsc.fromXML(text);
    const timeEvents = imscDoc.getMediaTimeEvents();

    for (let i = 0; i < timeEvents.length; i++) {
      let myCue;
      if (i < timeEvents.length - 1) {
        myCue = new VTTCue(timeEvents[i], timeEvents[i + 1], "");
      } else {
        myCue = new VTTCue(timeEvents[i], myVideo.duration, "");
      }
      myCue.addEventListener("enter", function () {
        clearSubFromScreen();
        const myIsd = imsc.generateISD(imscDoc, this.startTime);
        console.log({ myIsd });
        imsc.renderHTML(myIsd, renderDiv);
      });
      const r = myTrack.addCue(myCue);
    }
  }

  onMount(async () => {
    if (myVideo.readyState >= 2) {
      videoReady();
    } else {
      myVideo.addEventListener("loadedmetadata", videoReady);
    }
  });
</script>

<div id="videoContainer">
  <video
    bind:this={myVideo}
    src={srcVideo}
    height="288px"
    width="512px"
    muted
    loop
    controls
  >
    <track
      src={srcTtml}
      kind="subtitles"
      label="Expanded TTML Sample"
      srclang="en"
    />
  </video>
</div>
<div bind:this={renderDiv} id="render-div"></div>

<style>
  #videoContainer {
    position: absolute;
  }

  #render-div {
    display: flex;
    border: 1px solid #558abb;
    height: 288px;
    width: 512px;
    margin-bottom: 10px;
    position: absolute;
    pointer-events: none;
  }
</style>
