<!-- HOME PAGE OF WEBSITE






 -->
<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    return {
      props: {
        blogs: await fetch("/blog.json").then((res) => res.json()),
        events: await fetch("/events.json").then((res) => res.json()),
      },
    };
  }
</script>

<script lang="ts">
  // Imports

  // Components
  import HeadTags from "$components/head-tags/HeadTags.svelte";
  import FeaturedContent from "$components/featured-content/FeaturedContent.svelte";
  import LooseLipsBanner from "$components/loose-lips-banner/LooseLipsBanner.svelte";
  import EventsContainer from "$shared/components/events-container/EventsContainer.svelte";
  import RecentPostsContainer from "$shared/components/recent-posts-container/RecentPostsContainer.svelte";
  import EditorialPostsContainer from "$shared/components/editorial-posts-container/EditorialPostsContainer.svelte";

  // Models
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IEventsCard } from "$lib/models/interfaces/ievents-card.interface";

  // Exports
  export let blogs!: IBlog[];
  export let events: IEventsCard[];

  const posts = [...blogs, ...events];

  // Add metatags for page
  /**
   * @type {IMetaTagProperties}
   */
  const metaData: Partial<IMetaTagProperties> = {
    title: `LOOSE LIPS | Live`,
    description: "Loose lips label radio and blogging website).",
    keywords: ["radio", "mixes", "london radio", "music"],
  };
  // End: Local component properties

  console.log("home");
</script>

<!-- Start: Header Tag -->
<HeadTags {metaData} />
<LooseLipsBanner />
<!-- Start: Home Page container -->

<div class="w-[75%]">
  <FeaturedContent {posts} />
  <h1 class="text-white">
    ___________________________________________________________________________________________________________________________________________
  </h1>
  <RecentPostsContainer {posts} />
  <!-- <EditorialPostsContainer {posts} /> -->
  <EventsContainer />
</div>
