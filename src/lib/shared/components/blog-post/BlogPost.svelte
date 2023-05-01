<script lang="ts">
  import TagsContainer from "$ui/components/tags-container/TagsContainer.svelte";
  import type { IBlog } from "$models/interfaces/iblog.interface";
  /**
   * @type {IBlog}
   */
  export let blog!: IBlog;
</script>

{#if blog && blog?.slug}
  <div class="mb-8 w-full border-b border-gray-100 dark:border-gray-800 pb-5">
    <a data-sveltekit:prefetch href={`../blog/${blog.slug}`} class="w-full">
      {#if blog.banner.length !== 0}
        <div class="flex flex-col md:flex-row justify-between">
          <img src={blog.banner} alt="" style="height: 12em; width:100%;" />
        </div>
      {/if}
      <h3
        class="text-lg md:text-xl font-medium mb-2 w-full text-gray-900 dark:text-gray-100"
      >
        {blog.title}
      </h3>
    </a>
    <p class="text-gray-600 dark:text-gray-400">
      {blog.description.substring(0, 100)}...
      {blog.description}
    </p>
    <!-- <p class="text-gray-600 dark:text-gray-400">Read More...</p> -->
    <p class="text-gray-600 dark:text-gray-400">{blog.date}</p>
    <h4 class=" italic font-thin text-gray-300 text-lg md:text-xl mb-2 w-full ">
      {blog.tags}
    </h4>
  </div>
{/if}
