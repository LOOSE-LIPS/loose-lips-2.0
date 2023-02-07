<script lang="ts">
  import EventPost from "$lib/shared/components/event-post/EventPost.svelte";
  import type { IEventsCard } from "$models/interfaces/ievents-card.interface";
</script>

<div class="flex flex-row justify-left items-start max-w-2xl mx-auto">
  <div class="p-5">
    <!-- Start: Events -->
    <h2
      class="font-bold text-2xl md:text-2xl tracking-tight mb-2 max-w-1xl text-black dark:text-white"
    >
      Upcoming Events
    </h2>
    <!-- {#if events.length > 0}
      {#each events as event}
        <ProjectCard project={event} />
      {/each}
    {/if}
    <a href="events" class="viewAll">
      <p class="font-italic text-m text-white">View past events</p>
    </a> -->
    <!-- End: Top Events -->
  </div>
</div>
