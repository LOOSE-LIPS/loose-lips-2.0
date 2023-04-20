<!-- HOME PAGE OF WEBSITE






 -->
<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    return {
      props: {
        events: await fetch(`/events.json?recent=${200}`).then((res) =>
          res.json()
        ),
      },
    };
  }
</script>

<script lang="ts">
  import HeadTags from "$components/head-tags/HeadTags.svelte";
  import EventPost from "$lib/shared/components/event-post/EventPost.svelte";
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";
  import type { IEventsCard } from "$lib/models/interfaces/ievents-card.interface";

  /**
   * @type {IMetaTagProperties}
   */
  export let events: IEventsCard[];
  console.log(events);

  const metaData: Partial<IMetaTagProperties> = {
    title: `Events`,
    description: "events page",
    keywords: ["events"],
  };
</script>

<HeadTags {metaData} />

<div
  class="flex flex-col justify-center mt-28 items-start max-w-30 mx-auto mb-16"
>
  <h2
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"
  >
    Upcoming Events
  </h2>

  <h2
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"
  >
    Past Events
  </h2>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between gap-5"
  >
    {#if events.length > 0}
      {#each events as event}
        <EventPost {event} />
      {/each}
    {/if}
  </div>

  <a href="events" class="viewAll">
    <p class="font-italic text-m text-white">View past events</p>
  </a>
</div>
