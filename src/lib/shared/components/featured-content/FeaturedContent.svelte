<script lang="ts">
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IEventsCard } from "$models/interfaces/ievents-card.interface";
  import FeaturedPost from "../featuredPost/FeaturedPost.svelte";
  export let posts: (IBlog | IEventsCard)[];
  const featuredBlogs: (IBlog | IEventsCard)[] = posts.filter((blog) => {
    return blog.featured;
  });

  let currentPost: IBlog | IEventsCard;
  let currIndex = 0;

  function advanceIndex() {
    currIndex++;
    if (currIndex >= featuredBlogs.length) {
      currIndex = 0;
    }
    currentPost = featuredBlogs[currIndex];
  }

  setInterval(advanceIndex, 2000);
</script>

<div class="w-[100%] ">
  <h2
    id="featured"
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 max-w-5xl text-black dark:text-white"
  >
    Featured
  </h2>

  <div class=" border border-gray-200mb-8">
    <FeaturedPost {currentPost} />
  </div>
</div>
