<script lang="ts">
  // Start: Local Imports
  // Components
  import TagsContainer from "$ui/components/tags-container/TagsContainer.svelte";

  // Models
  import type { IBlog } from "$models/interfaces/iblog.interface";

  // End: Local Imports

  // Start: Exported Properties
  /**
   * @type {IBlog}
   */
  // export let blog!: IBlog;
  export let currentPost: IBlog;

  // End: Exported Properties
</script>

{#if currentPost && currentPost?.slug}
  <div class="w-full  border-gray-100 dark:border-gray-800 pb-5 h-[50%]">
    <a
      data-sveltekit:prefetch
      href={`/blog/${currentPost.slug}`}
      class="w-full"
    >
      <div class="flex flex-col md:flex-row justify-between">
        <img src={currentPost.banner} alt="" class="w-[100%]  " />

        <!-- <p class="text-gray-500 text-left md:text-right w-32 mb-4 md:mb-0">
                      {`${views ? new Number(views).toLocaleString() : '–––'} views`}
                  </p> -->

        <h3
          class="text-lg md:text-xl font-medium mb-2 w-full text-gray-900 dark:text-gray-100 absolute"
        >
          {currentPost.title}
        </h3>
      </div>
    </a>
  </div>
  <!-- <hr class="w-full border-1 border-gray-200 dark:border-gray-800 mb-8" /> -->
{/if}
