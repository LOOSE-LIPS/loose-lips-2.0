<script lang="ts">
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import { convertToSlug } from "$utils/convert-to-slug";
  import { blogTags } from "$data/tags";
  export let blogs!: IBlog[];

  let listWithDuplicatetags: string[] = [];

  blogs.forEach((blog) => {
    listWithDuplicatetags =
      listWithDuplicatetags.length === 0
        ? [...blog.tags]
        : [...listWithDuplicatetags, ...blog.tags];
  });
  $: tags = [...new Set(listWithDuplicatetags)];

  // const tags = blogs
  //   .map((x) => x.tags)
  //   .filter((x) => x.trim())
  //   .reduce((a, b) => (a.includes(b) ? a : [...a, b]), []);

  // let selectedTags = [];
  // let visible = blogs;
  // let searchValue = "";

  // const handleTagClick = (tag) => {
  //   if (selectedTags.includes(tag)) {
  //     selectedTags = selectedTags.filter((x) => x !== tag);
  //   } else {
  //     selectedTags = [...selectedTags, tag];
  //   }
  //   visible = blogs.filter((x) => {
  //     if (selectedTags.length === 0) return true;
  //     return selectedTags.includes(x.tags);
  //   });
  // };
</script>

<div class="flex flex-row flex-wrap w-full mt-4 items-center">
  {#each blogTags as tag, index (tag)}
    <a
      data-sveltekit:prefetch
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
