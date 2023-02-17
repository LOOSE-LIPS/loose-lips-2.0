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
  import RecentPost from "../recent-post/RecentPost.svelte";
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IEventsCard } from "$lib/models/interfaces/ievents-card.interface";
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
    .slice(0, 10);
</script>

<div class="flex flex-row  items-start mb-16 ">
  <h2
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em m-4"
    style="margin-top: 15%;"
  >
    Recent Posts
  </h2>
  <div class="grid  grid-cols-3">
    {#each mostRecentPosts as post}
      <div>
        <RecentPost {post} />
      </div>
    {/each}
  </div>
</div>
