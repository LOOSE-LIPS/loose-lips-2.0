<script lang="ts">
  import TagsContainer from "$ui/components/tags-container/TagsContainer.svelte";
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IEventsCard } from "$models/interfaces/ievents-card.interface";
  /**
   * @type {IBlog}
   */
  export let currentPost: IBlog | IEventsCard;
</script>

{#if currentPost && currentPost?.slug}
  <div class="w-full  border-gray-100 dark:border-gray-800 h-[50%]">
    <a
      data-sveltekit:prefetch
      href={`../../blog/${currentPost.slug}`}
      class="w-full"
    >
      <div class="flex flex-col md:flex-row justify-between">
        <img src={currentPost.banner} alt="" class="w-[100%] h-[18rem] md:h-[25em] lg:h-[32em]" />

        <h3
          class=" p-2.5 text-lg md:text-xl font-medium mb-2 w-full text-gray-900 dark:text-gray-100 absolute w-1/2"
        >
          {currentPost.title}
        </h3>
      </div>
    </a>
  </div>
  <!-- <hr class="w-full border-1 border-gray-200 dark:border-gray-800 mb-8" /> -->
{/if}
