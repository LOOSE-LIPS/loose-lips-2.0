<script lang="ts">
  import type { IEventsCard } from "$lib/models/interfaces/ievents-card.interface";
  import type { IBlog } from "$models/interfaces/iblog.interface";

  export let post: IBlog | IEventsCard;
  const isIBlog = (x: IBlog | IEventsCard): x is IBlog => x.layout === "blog";
  const isIEventCard = (x: IEventsCard): x is IEventsCard =>
    x.layout === "event";
  console.log(post.banner);
</script>

<div class="mb-8 w-full border-b border-gray-100 dark:border-gray-800 pb-5">
  <a data-sveltekit:prefetch href={`../blog/${post.slug}`} class="w-full">
  <div class="flex flex-col md:flex-row justify-between">
    {#if post.banner}
      <img
        src={`../../${post.banner}`}
        alt=""
        style="height: 12em; width:100%;"
      />
    {/if}
  </div>

  <h3
    class="text-lg md:text-xl font-medium mb-2 w-full text-gray-900 dark:text-gray-100"
  >
    {post.title}
  </h3>
</a>
</div>
