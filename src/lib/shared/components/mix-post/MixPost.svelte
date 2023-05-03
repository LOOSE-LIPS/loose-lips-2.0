<script lang="ts">
  import { currentTrack } from "../../../../stores";
  /**
   * @type {IMix}
   */

  export let mixData: any;
  const setTrack = (e: any) => {
    currentTrack.set(mixData.iframeLink);
  };
  // console.log(currentTrack);
</script>

<div class="flex-col h-[100%] m-6 cursor-pointer ">
  <!-- <button class="bg-white w-20 h-20" on:click={setTrack} /> -->
  <img class="hover:opacity-10" src={mixData.banner} alt="banner" />

  <a data-sveltekit:prefetch href={`../mixes/${mixData.slug}`} class="w-full">
    <h3
      class="text-lg md:text-xl font-medium  w-full text-gray-900 dark:text-gray-100"
    >
      {mixData.title}
    </h3>
  </a>
</div>
