<script lang="ts">
  import type { IEventsCard } from "$lib/models/interfaces/ievents-card.interface";
  import { addToStore } from "$utils/add-to-store";
  /**
   * @type {IBlogPostSummary}
   */
  export let event!: IEventsCard;
</script>

{#if event && event?.slug}
  <a
    on:click={(e) => {
      addToStore(event);
    }}
    data-sveltekit:prefetch
    href={`../events/${event.slug}`}
    class="w-full"
  >
    <div
      class="mb-4 hover:transition-shadow hover:shadow dark:hover:transition-shadow dark:hover:shadow-dark flex items-center border border-gray-200 dark:border-gray-800 rounded p-4"
    >
      <div class="h-4 w-4ml-2 mr-4 flex-shrink-0" />
      <div>
        <h2
          class="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-5"
        >
          {event?.title}
        </h2>
        <p
          class="leading-5 text-gray-700 dark:text-gray-300"
          style="float: right;"
        >
          {event?.date}
        </p>
        <img src={event?.banner} alt="" />
        <p class="leading-5 text-gray-700 dark:text-gray-300 mt-5">
          <!-- {event?.description} -->
        </p>
      </div>
    </div>
  </a>
{/if}
