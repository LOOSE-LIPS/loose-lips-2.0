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
  export let blog!: IBlog;
  console.log(blog.slug);

  // End: Exported Properties
</script>

{#if blog && blog?.slug}
  <div class="mb-8 w-full border-b border-gray-100 dark:border-gray-800 pb-5">
    <a
      data-sveltekit:prefetch
      href={`../markdownfiles/blogs/${blog.slug}`}
      class="w-full"
    >
      <div class="flex flex-col md:flex-row justify-between">
        <img src={blog.banner} alt="" style="height: 12em; width:100%;" />
      </div>

      <h3
        class="text-lg md:text-xl font-medium mb-2 w-full text-gray-900 dark:text-gray-100"
      >
        {blog.title}
      </h3>
    </a>
    <p class="text-gray-600 dark:text-gray-400">{blog.description}</p>
    <p class="text-gray-600 dark:text-gray-400">{blog.date}</p>
    <TagsContainer tags={blog.tags} />
  </div>
  <!-- <hr class="w-full border-1 border-gray-200 dark:border-gray-800 mb-8" /> -->
{/if}
