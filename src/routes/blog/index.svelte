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
  import TagsContainer from "$shared/components/tags-container/TagsContainer.svelte";
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";
  import { convertToSlug } from "$utils/convert-to-slug";

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

  const mostRecentBlogs: IBlog[] = blogs
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .slice(0, 150);

  let searchValue = "";
  $: filteredBlogPosts = blogs
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchValue.toLowerCase())
    );

  let listWithDuplicatetags: string[] = [];

  // blogs.forEach((blog) => {
  //   listWithDuplicatetags =
  //     listWithDuplicatetags.length === 0
  //       ? [...blog.tags]
  //       : [...listWithDuplicatetags, ...blog.tags];
  // });
  // $: tags = [...new Set(listWithDuplicatetags)];
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
    <!-- There are {blogs.length} articles on this site. Use
		<a sveltekit:prefetch href="/tags" aria-label="tags" class="text-blue-500 hover:text-blue-700 transition"
			>tags</a
		>
		to get articles based on different tags. Use the search below to filter by title. -->
  </p>
  <!-- <div class="flex flex-row flex-wrap w-full mt-4 items-center">
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
  </div> -->
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

  {#if !searchValue}
    <h2
      class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"
    >
      Most Recent
    </h2>
    <div
      class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 justify-between gap-5"
    >
      {#each mostRecentBlogs as blog}
        <BlogPost {blog} />
      {/each}
    </div>
  {:else}
    <h2
      class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"
    >
      All Posts
    </h2>
    {#if filteredBlogPosts.length === 0}
      <p class="text-gray-600 dark:text-gray-400 mb-4">No posts found.</p>
    {:else}
      <div
        class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 justify-between gap-5"
      >
        {#each filteredBlogPosts as blog}
          <BlogPost {blog} />
        {/each}
      </div>
    {/if}
  {/if}
</div>
