<script lang="ts">
  import type { IBlog } from "$lib/models/interfaces/iblog.interface";
  import EventPost from "$lib/shared/components/event-post/EventPost.svelte";
  import type { IEventsCard } from "$models/interfaces/ievents-card.interface";
  export let events: IEventsCard[];

  const isDateInFuture = (dateString) => {
    const inputDate = new Date(dateString);
    const currentDate = new Date();

    return inputDate.getTime() > currentDate.getTime();
  };

  const futureEvents = events.filter((event) => isDateInFuture(event.date));
  const pastEvents = events
    .filter((event) => !isDateInFuture(event.date))
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .slice(0, 10);

  console.log(pastEvents);
</script>

<div class="flex flex-row justify-left items-start mx-auto">
  <div class="">
    <h2
      class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white  m-4"
    >
      Upcoming Events
    </h2>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between gap-5"
    >
      {#if futureEvents.length > 0}
        {#each futureEvents as event}
          <EventPost {event} />
        {/each}
      {:else}
        <h1
          class=" text-1xl md:text-1xl tracking-tight mb-4 text-black dark:text-white  m-4"
        >
          There are no upcoming events...
        </h1>
      {/if}
    </div>
    <a href="events" class="viewAll">
      <p class="font-italic text-m text-white">Past Events</p>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between gap-5"
      >
        {#each pastEvents as event}
          <EventPost {event} />
        {/each}
      </div>
    </a>
  </div>
</div>
