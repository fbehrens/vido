<script>
  import { onMount } from "svelte";

  onMount(async () => {
    const renderDiv = document.getElementById("render-div");
    const myVideo = document.getElementById("imscVideo");
    const myTrack = myVideo.textTracks[0];
    const ttmlUrl = myVideo.getElementsByTagName("track")[0].src;
    myTrack.mode = "hidden";
    const response = await fetch(ttmlUrl);
    const text = await response.text();
    const imscDoc = imsc.fromXML(text);
    const timeEvents = imscDoc.getMediaTimeEvents();
    console.log({ ttmlUrl, myTrack, text, timeEvents });
    function clearSubFromScreen() {
      const subtitleActive = renderDiv.getElementsByTagName("div")[0];
      if (subtitleActive) {
        renderDiv.removeChild(subtitleActive);
      }
    }

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
        imsc.renderHTML(myIsd, renderDiv);
      });
      myCue.addEventListener("exit", function () {
        clearSubFromScreen();
      });
      const r = myTrack.addCue(myCue);
    }
  });
</script>

<svelte:head>
  <script src="https://unpkg.com/imsc@1.1.5/dist//imsc.all.min.js"></script>
</svelte:head>
<div id="videoContainer">
  <video
    src="/ttml/coffee.mp4"
    id="imscVideo"
    height="288px"
    width="512px"
    muted
    loop
    controls
  >
    <track
      src="/ttml/coffee.ttml"
      kind="subtitles"
      label="Expanded TTML Sample"
      srclang="en"
    />
  </video>
</div>
<div id="render-div"></div>

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
