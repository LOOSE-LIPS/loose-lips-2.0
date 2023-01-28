<script lang="ts">
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import { convertToSlug } from "$utils/convert-to-slug";
  export let blogs!: IBlog[];

  let listWithDuplicatetags: string[] = [];

  blogs.forEach((blog) => {
    listWithDuplicatetags =
      listWithDuplicatetags.length === 0
        ? [...blog.tags]
        : [...listWithDuplicatetags, ...blog.tags];
  });
  $: tags = [...new Set(listWithDuplicatetags)];
</script>

<div class="flex flex-row flex-wrap w-full mt-4 items-center">
  {#each tags as tag, index (tag)}
    <a
      data-sveltekit:prefetch
      href={`/tags/${convertToSlug(tag)}`}
      aria-label={tag}
      class="text-xl font-bold text-black-400 text-black dark:text-white hover:text-white dark:hover:text-white"
    >
      {tag.toUpperCase()}
    </a>
    {#if index !== tags.length - 1}
      <p class="mr-2 ml-2 text-black dark:text-white">
        {` • `}
      </p>
    {/if}
  {/each}
</div>
