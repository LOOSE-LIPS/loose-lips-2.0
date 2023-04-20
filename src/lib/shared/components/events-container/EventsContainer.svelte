<script lang="ts">
  import type { IBlog } from "$lib/models/interfaces/iblog.interface";
  import EventPost from "$lib/shared/components/event-post/EventPost.svelte";
  import type { IEventsCard } from "$models/interfaces/ievents-card.interface";
  export let events: IEventsCard[];
</script>

<div class="flex flex-row justify-left items-start mx-auto">
  <div class="">
    <h2
      class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white  m-4"
    >
      Events
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
</div>
