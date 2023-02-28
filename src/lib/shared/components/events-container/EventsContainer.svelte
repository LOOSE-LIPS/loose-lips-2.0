<script lang="ts">
  import type { IBlog } from "$lib/models/interfaces/iblog.interface";
  import EventPost from "$lib/shared/components/event-post/EventPost.svelte";
  import type { IEventsCard } from "$models/interfaces/ievents-card.interface";
  export let events: IEventsCard[];
</script>

<div class="flex flex-row justify-left items-start max-w-2xl mx-auto">
  <div class="">
    <h2
      class="font-bold text-2xl md:text-2xl tracking-tight mb-2 max-w-1xl text-black dark:text-white"
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
  </div>
</div>
