<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    return {
      props: {
        blogs: await fetch(`/blog.json?recent=${5}`).then((res) => res.json()),
      },
    };
  }
</script>

<script lang="ts">
  import BlogPost from "../blog-post/BlogPost.svelte";
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IEventsCard } from "$lib/models/interfaces/ievents-card.interface";
  import EventPost from "../event-post/EventPost.svelte";
  export let posts!: (IBlog | IEventsCard)[];

  let listWithDuplicatetags: string[] = [];

  posts.forEach((post) => {
    listWithDuplicatetags =
      listWithDuplicatetags.length === 0
        ? [...post.tags]
        : [...listWithDuplicatetags, ...post.tags];
  });
  $: tags = [...new Set(listWithDuplicatetags)];

  const mostRecentPosts: (IBlog | IEventsCard)[] = posts
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .slice(0, 3);

  const isIBlog = (x: IBlog | IEventsCard): x is IBlog => x.layout === "blog";
  const isIEventCard = (x: IEventsCard): x is IEventsCard =>
    x.layout === "event";
</script>

<div class="flex flex-row  items-start mb-16 border-2">
  <!-- Start: Popular Blog Section -->
  <h2
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em m-4"
    style="margin-top: 15%;"
  >
    Recent Posts
  </h2>
  <div class="grid grid-flow-col auto-cols-max overflow-x-auto">
    {#if posts.length > 0}
      {#each mostRecentPosts as post}
        {#if isIBlog(post)}
          <div
            class="p-4 h-auto  aspect-video object-cover w-[480px] bg-gray-900"
          >
            <BlogPost blog={post} />
          </div>
        {:else if isIEventCard(post)}
          <div
            class="p-4 h-auto  aspect-video object-cover w-[480px] bg-gray-900"
          >
            <EventPost event={post} />
          </div>
        {/if}
      {/each}
    {/if}
  </div>
  <!-- End: Popular Blog Section -->
</div>
