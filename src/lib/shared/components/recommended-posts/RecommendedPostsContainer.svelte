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
  import RecommendedPost from "../recommended-post/RecommendedPost.svelte";
  import { recommendedArray } from "../../../../stores";
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IEventsCard } from "$lib/models/interfaces/ievents-card.interface";
  export let posts!: (IBlog | IEventsCard)[];

  let recommendedPosts = [];
  recommendedArray.subscribe((data) => {
    posts.forEach((post) => {
      data.map((tag) => {
        post.tags.includes(tag)
          ? recommendedPosts.push(post)
          : console.log("nope");
      });
    });
  });
</script>

<div
  class="flex flex-col items-start max-w-6xl mx-auto mb-16 hover:transform-rotate(4deg) "
>
  <h2
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em m-6"
    style="margin-top: 15%;"
  >
    Recommended
  </h2>

  <div class="grid grid-flow-col auto-cols-max overflow-x-auto max-w-6xl">
    {#if recommendedPosts.length > 0}
      {#each recommendedPosts as post}
        <div>
          <RecommendedPost {post} />
        </div>
      {/each}
    {/if}
  </div>
</div>
