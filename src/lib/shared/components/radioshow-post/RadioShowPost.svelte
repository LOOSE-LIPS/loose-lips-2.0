<script lang="ts">
  import type { IMix } from "$models/interfaces/imix.interface";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  /**
   * @type {IMix}
   */
  export let showData: any;

  let isPlaying = false;
  let iframeRef;
  onMount(() => {
    window.addEventListener("message", handleMessage);
  });

  function handleMessage(event) {
    // Check that the message came from the iframe and contains playback state data
    if (event.source === iframeRef.contentWindow && event.data.playbackState) {
      isPlaying = event.data.playbackState === "playing";
    }
  }

  function handleIframeLoad() {
    console.log("test");
  }
</script>

<div class="flex-col h-[100%] m-6 ">
  <a
    href={showData.soundCloudUrl}
    title={showData.title}
    style="color: #cccccc; text-decoration: none;"
  >
    <h3
      class="text-lg md:text-xl font-medium  w-full text-gray-900 dark:text-gray-100"
    >
      {showData.title}
    </h3>
    <img src={showData.banner} alt="banner" />
  </a>
  <iframe
    title="title"
    width="100%"
    height="166"
    scrolling="no"
    frameborder="no"
    allow="autoplay"
    src={showData.iframeLink}
    bind:this={iframeRef}
    on:load={handleIframeLoad}
  />
  <div
    style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"
  />
</div>
