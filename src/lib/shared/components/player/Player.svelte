<script lang="ts">
  import { currentTrack } from "$stores";
  import { onMount } from "svelte";
  let widget;
  export let track;

  const getSc = async () => {
    if ((window as any)?.SC) return (window as any)?.SC;
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getSc();
  };

  const handleSoundCloudWidget = async () => {
    const sc = await getSc();
    let iframeElement = document.getElementById("perP");
    widget = sc.Widget(iframeElement);

    widget.bind(sc.Widget.Events.READY, function () {
      console.log("LETS GOOOOOOO");
      if (track != "") {
        setTimeout(() => {
          widget.play();
        }, 5000);
      }
    });
  };

  onMount(() => {
    if (!document.getElementById("perScript")) {
      const script = document.createElement("script");
      script.id = "perScript";
      script.src = "https://w.soundcloud.com/player/api.js";
      document.body.appendChild(script);
      script.onload = () => handleSoundCloudWidget();
      return;
    }
    handleSoundCloudWidget();
  });
</script>

<div class="fixed bottom-0 left-0 right-0 bg-white text-black h-36 py-2 px-4">
  <h1>PERMANENT Player</h1>

  <iframe
    id="perP"
    title="title"
    width="100%"
    height="100%"
    scrolling="no"
    frameborder="no"
    allow="autoplay"
    src={track}
  />
</div>
