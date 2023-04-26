<script lang="ts">
  import RecommendedPost from "../recommended-post/RecommendedPost.svelte";
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IEventsCard } from "$lib/models/interfaces/ievents-card.interface";
  import { onMount } from "svelte";
  import { beforeUpdate } from "svelte";
  export let tags;

  let recommendedPosts = [];

  onMount(async () => {
    await fetch("/blog.json")
      .then((res) => res.json())
      .then((res) => {
        res
          .filter((post) => {
            return post.tags.includes(tags);
          })
          .map((post) => {
            let random = Math.random();
            recommendedPosts.push(post);
            recommendedPosts = recommendedPosts.slice(
              random * 100 - (100 - recommendedPosts.length),
              3
            );
          });
      });
  });
  console.log(recommendedPosts.length);
</script>

<div
  class="flex flex-col justify-center items-center max-w-6xl mx-auto mb-16 hover:transform-rotate(4deg) "
>
  <h2
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em m-6"
    style="margin-top: 15%;"
  >
    Recommended
  </h2>

  <div
    class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 items-center justify-between w-full"
  >
    {#each recommendedPosts as post}
      <div>
        <RecommendedPost {post} />
      </div>
    {/each}
  </div>
</div>
