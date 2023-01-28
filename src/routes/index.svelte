<!-- HOME PAGE OF WEBSITE






 -->
<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    return {
      props: {
        blogs: await fetch(`/blog.json?recent=${5}`).then((res) => res.json()),
      },
    };
  }
</script>

<script lang="ts">
  // Imports

  // Components
  import HeadTags from "$components/head-tags/HeadTags.svelte";
  import BlogPost from "$components/blog-post/BlogPost.svelte";

  import FeaturedContent from "$components/featured-content/FeaturedContent.svelte";
  import LooseLipsBanner from "$components/loose-lips-banner/LooseLipsBanner.svelte";
  import EventsContainer from "$shared/components/events-container/EventsContainer.svelte";
  import RecentPostsContainer from "$shared/components/recent-posts-container/RecentPostsContainer.svelte";

  // Models
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";

  import type { IBlog } from "$models/interfaces/iblog.interface";

  import { convertToSlug } from "$utils/convert-to-slug";

  // Exports
  export let blogs!: IBlog[];

  // Add metatags for page
  /**
   * @type {IMetaTagProperties}
   */
  const metaData: Partial<IMetaTagProperties> = {
    title: `LOOSE LIPS | Live`,
    description: "Loose lips label radio and blogging website).",
    keywords: ["radio", "mixes", "london radio", "music"],
  };

  let searchValue = "";
  $: filteredBlogPosts = blogs
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchValue.toLowerCase())
    );

  // End: Local component properties

  // Local Methods

  let listWithDuplicatetags: string[] = [];

  blogs.forEach((blog) => {
    listWithDuplicatetags =
      listWithDuplicatetags.length === 0
        ? [...blog.tags]
        : [...listWithDuplicatetags, ...blog.tags];
  });
  $: tags = [...new Set(listWithDuplicatetags)];

  const featuredBlogs: IBlog[] = blogs.filter((blog) => {
    return blog.featured;
  });

  // const featuredBlogs = blogs;
</script>

<!-- Start: Header Tag -->
<HeadTags {metaData} />

<LooseLipsBanner />
<!-- Start: Home Page container -->

<FeaturedContent {featuredBlogs} />

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
<div class="w-[75%]">
  <div
    class="flex flex-row  items-start max-w-6xl mx-auto mb-16 hover:transform-rotate(4deg)"
  >
    <!-- Start: Popular Blog Section -->
    <!-- <h2
      class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em"
      style="margin-top: 15%;"
    >
      Recent Posts
    </h2>
    <div />
    {#if blogs.length > 0}
      {#each blogs as blog, index (blog.slug)}
        <div class="p-5">
          <BlogPost {blog} />
        </div>
      {/each}
    {/if} -->
    <!-- End: Popular Blog Section -->

    <RecentPostsContainer {blogs} />
  </div>

  <div
    class="flex flex-row justify-center items-start max-w-6xl mx-auto mb-16 hover:transform-rotate(4deg)"
  >
    <!-- Start: Popular Blog Section -->
    <h2
      class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em"
    >
      Editorial Posts
    </h2>
    <div />
    {#if blogs.length > 0}
      {#each blogs as blog, index (blog.slug)}
        <div class="p-5">
          <BlogPost {blog} />
        </div>
      {/each}
    {/if}
    <!-- End: Popular Blog Section -->
  </div>
</div>

<EventsContainer />

<!-- End: Home Page container -->

Old code for audio player

<!-- <div class="audio" style="position:fixed;left:0;bottom:0;width:;">
	<Aplayer audio={
		{name:'君の知らない物語',
		artist: 'supercell',
		cover: 'https://blog-static.fengkx.top/svelte-aplayer/bakemonogatari-ed.jpg',
		url: "https://blog-static.fengkx.top/svelte-aplayer/bakemonogatari-ed.mp3"}} />

</div> -->
