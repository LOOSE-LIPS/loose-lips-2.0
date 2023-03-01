<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    return {
      props: {
        blogs: await fetch("/blog.json").then((res) => res.json()),
        events: await fetch("/events.json").then((res) => res.json()),
        mixes: await fetch("/mixes.json").then((res) => res.json()),
      },
    };
  }
</script>

<script lang="ts">
  import HeadTags from "$components/head-tags/HeadTags.svelte";
  import FeaturedContent from "$components/featured-content/FeaturedContent.svelte";
  import TagsContainer from "$shared/components/tags-container/TagsContainer.svelte";
  import EventsContainer from "$shared/components/events-container/EventsContainer.svelte";
  import RecentPostsContainer from "$shared/components/recent-posts-container/RecentPostsContainer.svelte";
  import RecommendedPostsContainer from "$lib/shared/components/recommended-posts/RecommendedPostsContainer.svelte";
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IEventsCard } from "$lib/models/interfaces/ievents-card.interface";
  import type { IMix } from "$lib/models/interfaces/imix.interface";

  export let blogs!: IBlog[];
  export let events: IEventsCard[];
  export let mixes: IMix[];

  const posts = [...blogs, ...events];

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

  console.log("home");
</script>

<HeadTags {metaData} />

<div class="w-[100%] mt-28">
  <FeaturedContent {posts} />
  <!-- <TagsContainer {blogs} /> -->

  <RecentPostsContainer {posts} />
  <!-- <EventsContainer {events} /> -->
</div>

<style>
  :global(body) {
    overflow-x: hidden;
  }
</style>
