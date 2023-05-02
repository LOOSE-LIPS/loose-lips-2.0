<script lang="ts">
  // Start: Local Imports
  // Components
  import TagsContainer from "$ui/components/tags-container/TagsContainer.svelte";

  // Models
  import type { IBlog } from "$models/interfaces/iblog.interface";
  /**
   * @type {IBlog}
   */
  export let label!: IBlog;

  // End: Exported Properties
</script>

{#if label && label?.slug}
  <div class="mb-8 w-full border-b border-gray-100 dark:border-gray-800 pb-5">
    <a data-sveltekit:prefetch href={`../label/${label.slug}`} class="w-full">
      <div class="flex flex-col md:flex-row justify-between">
        <img src={label.banner} alt="" style="height: 100%; width:100%;" />
      </div>

      <h3
        class="text-lg md:text-xl font-medium mb-2 w-full text-gray-900 dark:text-gray-100"
      >
        {label.title}
      </h3>
    </a>
    <!-- <p class="text-gray-600 dark:text-gray-400">{label.description}</p> -->
    <p class="text-gray-600 dark:text-gray-400">{label.date}</p>
    <!-- <TagsContainer tags={blog.tags} /> -->
  </div>
  <!-- <hr class="w-full border-1 border-gray-200 dark:border-gray-800 mb-8" /> -->
{/if}
