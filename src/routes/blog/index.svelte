<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    return {
      props: {
        blogs: await fetch("/blog.json").then((res) => res.json()),
      },
    };
  }
</script>

<script lang="ts">
  import HeadTags from "$components/head-tags/HeadTags.svelte";
  import BlogPost from "$components/blog-post/BlogPost.svelte";
  import Button from "$shared/ui/components/button/Button.svelte";
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";
  export let blogs!: IBlog[];

  /**
   * @type {IMetaTagProperties}
   */
  const metaData: Partial<IMetaTagProperties> = {
    title: "blogs",
    description: "blog page",
    url: "/blog",
    searchUrl: "/blog",
  };

  const tags = blogs
    .map((x) => x.tags)
    .reduce((a, b) => (a.includes(b) ? a : [...a, b]), []);

  let visible = blogs;

  let searchValue = "";
  $: searchedBlogs = visible
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchValue.toLowerCase())
    );

  let selectedTags = [];
  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter((x) => x !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
    visible = blogs.filter((x) => {
      if (selectedTags.length === 0) return true;
      return selectedTags.includes(x.tags);
    });
  };
</script>

<HeadTags {metaData} />
<div class="flex flex-col justify-center w-[100%]  mb-16 mt-28">
  <h1
    class="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white"
  >
    Blog
  </h1>

  <p class="text-gray-600 dark:text-gray-400 mb-4">
    Discover a wealth of music-related content with our extensive collection of
    blog posts. From in-depth album reviews and artist interviews to the latest
    industry news and concert coverage, our team of passionate music enthusiasts
    bring you the best of the music scene.
  </p>

  <div class="relative w-full mb-4">
    <input
      bind:value={searchValue}
      aria-label="Search articles"
      type="text"
      placeholder="Search articles"
      class="px-4 py-2 border border-gray-300 dark:border-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    />
    <svg
      class="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <!-- <TagsContainer {tags} /> -->
  </div>

  <h2
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"
  >
    Most Recent
  </h2>
  <div class="flex flex-row flex-wrap w-full mt-4 items-center mb-2">
    {#each tags as tag, index (tag)}
      <Button
        {tag}
        onClick={() => handleTagClick(tag)}
        active={selectedTags.includes(tag)}
      />
      {#if index !== tags.length - 1}
        <p class="mr-2 ml-2 text-black dark:text-white">
          {` • `}
        </p>
      {/if}
    {/each}
  </div>

  <div
    class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 justify-between"
  >
    {#if searchValue === ""}
      {#each visible as blog}
        <BlogPost {blog} />
      {/each}
    {:else}
      {#each searchedBlogs as blog}
        <BlogPost {blog} />
      {/each}
    {/if}
  </div>
</div>
