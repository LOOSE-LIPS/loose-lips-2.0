<script lang="ts">
  import type { IMix } from "$models/interfaces/imix.interface";
  import TagsContainer from "$shared/ui/components/tags-container/TagsContainer.svelte";

  /**
   * @type {IMix}
   */

  export let mixData: IMix;
<<<<<<< HEAD
  export let markupMixInfo;
  console.log("running");
=======
>>>>>>> 7d4e1fa190ffbccb38b5a7b54408c01878d90e87
</script>

<div class="flex-col h-[100%] m-6 ">
  <!-- <div
    style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"
  >
    <a
      href="https://soundcloud.com/loose-lips123"
      title="Loose Lips"
      target="_blank"
      style="color: #cccccc; text-decoration: none;">Loose Lips</a
    >
    ·
    <a
      href="https://soundcloud.com/loose-lips123/loose-lips-mix-series-410-highrise"
      title="Loose Lips Mix Series - 410 - Highrise"
      target="_blank"
      style="color: #cccccc; text-decoration: none;">{mixData.title}</a
    >
<<<<<<< HEAD
  </div>
  <!-- <a
    href="data-sveltekit:prefetch href={`/mixes/${markupMixInfo.slug}`}"
    title="Loose Lips Mix Series - 410 - Highrise"
    target="_blank" -->
=======
  </div> -->
>>>>>>> 7d4e1fa190ffbccb38b5a7b54408c01878d90e87
  >
  <h3
    class="text-lg md:text-xl font-medium  w-full text-gray-900 dark:text-gray-100"
  >
    {mixData.title}
  </h3>
<<<<<<< HEAD
  <!-- </a> -->
  <!-- <p>{mixData.description}</p> -->
=======
  <img src={mixData.banner} alt="banner" />
>>>>>>> 7d4e1fa190ffbccb38b5a7b54408c01878d90e87
  <iframe
    id="sc-widget"
    title={mixData.title}
    width="100"
    height="160"
    scrolling="no"
    frameborder="yes"
    allow="autoplay"
    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/{mixData.id}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=false"
  />

  <!-- <TagsContainer tags={mixData.tags} /> -->
</div>
