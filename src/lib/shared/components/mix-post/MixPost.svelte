<script lang="ts">
  import type { IMix } from "$models/interfaces/imix.interface";
  import TagsContainer from "$shared/ui/components/tags-container/TagsContainer.svelte";

  /**
   * @type {IMix}
   */

  export let mixData: any;
  console.log(mixData);
</script>

<div class="flex-col h-[100%] m-6 ">
  >
  <h3
    class="text-lg md:text-xl font-medium  w-full text-gray-900 dark:text-gray-100"
  >
    {mixData.title}
  </h3>
  <img src={mixData.banner} alt="banner" />
  <iframe
    id="sc-widget"
    title={mixData.title}
    width="100"
    height="160"
    scrolling="no"
    frameborder="yes"
    allow="autoplay"
    src={mixData.iframeLink}
  />

  <!-- <TagsContainer tags={mixData.tags} /> -->
</div>
