<script lang="ts">
  import type { IEventsCard } from "$lib/models/interfaces/ievents-card.interface";
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import { addToStore } from "$utils/add-to-store";

  export let post: any;
  const isIBlog = (x: IBlog | IEventsCard): x is IBlog => x.layout === "blog";
  const isIEventCard = (x: IEventsCard): x is IEventsCard =>
    x.layout === "event";
  console.log(post.banner);
</script>

<div
  class=" mb-4 hover:shadow dark:hover:transition-shadow dark:hover:shadow-dark flex items-center border border-gray-200mb-8 w-full border-gray-100 dark:border-gray-800 p-2"
>
  <a
    on:click={(e) => {
      addToStore(post);
    }}
    data-sveltekit:prefetch
    href={`../blog/${post.slug}`}
    class="w-full"
  >
    {#if post.banner.length > 0}
      <div class="flex flex-col md:flex-row h-100">
        <img src={post.banner} alt="" style="height: 150%; width:100%;" />
      </div>
    {/if}
    <h3
      class="text-lg md:text-xl font-medium mb-2 w-full text-gray-900 dark:text-gray-100"
    >
      {post.title}
    </h3>
    <h4 class=" italic font-thin text-gray-300 text-lg md:text-xl mb-2 w-full ">
      {post.tags}
    </h4>
  </a>
</div>
