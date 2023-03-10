<script lang="ts">
  import type { IMix } from "$models/interfaces/imix.interface";
  /**
   * @type {IMix}
   */
  export let showData: any;
  console.log(showData.soundCloudUrl);
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
  />
  <div
    style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"
  />
</div>
