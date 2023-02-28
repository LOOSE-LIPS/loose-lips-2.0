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
  export let crewMember!: IBlog;
  // End: Exported Properties
</script>

{#if crewMember && crewMember?.slug}
  <div class="mb-8 w-full border-b border-gray-100 dark:border-gray-800 pb-5">
    <div class="flex flex-col md:flex-row justify-between">
      <img src={crewMember.banner} alt="profile pic" class="w-full" style="" />
    </div>
    <a
      data-sveltekit:prefetch
      href={`../crew/${crewMember.slug}`}
      class="w-full"
    >
      <h3
        class="text-lg md:text-xl font-medium mb-2 w-full text-gray-900 dark:text-gray-100"
      >
        {crewMember.title}
      </h3>
    </a>
    <!-- <p class="text-gray-600 dark:text-gray-400">{crewMember.description}</p> -->
    <p class="text-gray-600 dark:text-gray-400">{crewMember.date}</p>
    <TagsContainer tags={crewMember.tags} />
  </div>
  <!-- <hr class="w-full border-1 border-gray-200 dark:border-gray-800 mb-8" /> -->
{/if}
