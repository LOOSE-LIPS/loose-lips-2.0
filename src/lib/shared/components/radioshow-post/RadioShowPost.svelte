<script lang="ts">
  // import type { IMix } from "$models/interfaces/imix.interface";
  import { onMount } from "svelte";
  import { currentTrack } from "../../../../stores";

  let widget;
  let isPlaying = false;
  export let showData;
  const setTrack = (e: any) => {
    currentTrack.set(showData.iframeLink);
  };

  // const getSc = async () => {
  //   if ((window as any)?.SC) return (window as any)?.SC;
  //   await new Promise((resolve) => setTimeout(resolve, 100));
  //   return getSc();
  // };

  // const handleSoundCloudWidget = async () => {
  //   const sc = await getSc();
  //   let iframeElement = document.querySelector(
  //     `iframe[src="${showData.iframeLink}"]`
  //   );
  //   widget = sc.Widget(iframeElement);
  //   widget.bind(sc.Widget.Events.READY, function () {
  //     console.log("ready");
  //     widget.bind(sc.Widget.Events.PLAY, function () {
  //       isPlaying = true;
  //       console.log(isPlaying);
  //       currentTrack.set(showData.iframeLink);
  //     });
  //     widget.bind(sc.Widget.Events.PAUSE, function () {
  //       isPlaying = false;
  //       console.log(isPlaying);
  //     });
  //   });
  // };

  // onMount(() => {
  //   if (!document.getElementById("soundcloud-player")) {
  //     const script = document.createElement("script");
  //     script.id = "soundcloud-player";
  //     script.src = "https://w.soundcloud.com/player/api.js";
  //     document.body.appendChild(script);
  //     script.onload = () => handleSoundCloudWidget();
  //     return;
  //   }
  //   handleSoundCloudWidget();
  // });
</script>

<a
  data-sveltekit:prefetch
  href={`../radio-shows/${showData.slug}`}
  class="w-full"
>
  <div class="flex-col h-[100%] m-6 cursor-pointer" on:click={setTrack}>
    <!-- <a
    href={showData.soundCloudUrl}
    title={showData.title}
    style="color: #cccccc; text-decoration: none;"
  > -->

    <img src={showData.banner} alt="banner" />
    <h3
      class="text-lg md:text-xl font-medium  w-full text-gray-900 dark:text-gray-100"
    >
      {showData.title}
    </h3>
    <!-- </a> -->
    <!-- <iframe
    title="title"
    width="100%"
    height="166"
    scrolling="no"
    frameborder="no"
    allow="autoplay"
    src={showData.iframeLink}
  /> -->
    <div
      style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"
    />
  </div>
</a>
