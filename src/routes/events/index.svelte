<!-- HOME PAGE OF WEBSITE






 -->
<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    return {
      props: {
        events: await fetch(`/events.json?recent=${5}`).then((res) =>
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

  const metaData: Partial<IMetaTagProperties> = {
    title: `Events`,
    description: "events page",
    keywords: ["events"],
  };

  // EVENTS DATA
  //   const events: IProjectCard[] = [
  //     {
  //       title: "Loose Lips presents: Sunil Sharpe, Cersy & Kortzer",
  //       description:
  //         "Loose Lips brings the legendary Irish turntablist Sunil Sharpe to an exciting new Manchester spot fitted with a beautiful Danley soundsystem. Supported by up and coming techno talent Cersy, and Loose Lips resident Kortzer.",
  //       slug: "https://github.com/navneetsharmaui/sveltekit-starter",
  //       img:
  //         "https://imgproxy.ra.co/_/quality:66/w:1500/rt:fill/aHR0cHM6Ly9pbWFnZXMucmEuY28vODkxMjlmZGEzN2EzZjIxMDEwOTg1YzZiZmNmNjVjZDFlMGI1ZWIwYi5wbmc=",
  //       icon: "",
  //       date: "28/01/2023",
  //     },
  //   ];
</script>

<HeadTags {metaData} />

<div class="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
  <h2
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"
  >
    Upcoming Events
  </h2>
  {#if events.length > 0}
    {#each events as event}
      <EventPost {event} />
    {/each}
  {/if}
  <a href="events" class="viewAll">
    <p class="font-italic text-m text-white">View past events</p>
  </a>
  <h2
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"
  >
    Past Events
  </h2>
  {#if events.length > 0}
    {#each events as event}
      <EventPost {event} />
    {/each}
  {/if}
  <a href="events" class="viewAll">
    <p class="font-italic text-m text-white">View past events</p>
  </a>
</div>
