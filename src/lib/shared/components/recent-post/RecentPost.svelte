<script lang="ts">
  import type { IEventsCard } from "$lib/models/interfaces/ievents-card.interface";
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import { addToStore } from "$utils/add-to-store";

  export let post: IBlog | IEventsCard;
  const isIBlog = (x: IBlog | IEventsCard): x is IBlog => x.layout === "blog";
  const isIEventCard = (x: IEventsCard): x is IEventsCard =>
    x.layout === "event";
  console.log(post.banner);
</script>

<div class="mb-8 w-full border-gray-100 dark:border-gray-800 pb-5">
  <a
    on:click={(e) => {
      addToStore(post);
    }}
    data-sveltekit:prefetch
    href={`../markdownfiles/importPosts/${post.slug}`}
    class="w-full"
  >
    {#if post.banner.length > 0}
      <div class="flex flex-col md:flex-row justify-between">
        <img src={post.banner} alt="" style="height: 12em; width:100%;" />
      </div>
    {/if}
    <h3
      class="text-lg md:text-xl font-medium mb-2 w-full text-gray-900 dark:text-gray-100"
    >
      {post.title}
    </h3>
  </a>
</div>
