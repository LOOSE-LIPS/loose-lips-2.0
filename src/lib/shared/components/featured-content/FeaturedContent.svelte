<script lang="ts">
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import BlogPost from "$components/blog-post/BlogPost.svelte";
  import FeaturedPost from "../featuredPost/FeaturedPost.svelte";
  export let featuredBlogs: IBlog[];
  // export let dummyBlogs: IBlog[];

  let currentPost: IBlog;
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

<div class="w-[75%]">
  <h2
    id="featured"
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 max-w-5xl text-black dark:text-white"
  >
    Featured
  </h2>

  <!-- {#each featuredBlogs as blog}
  <FeaturedPost {blog} />
{/each} -->
  <div class="border-white border-4 ">
    <FeaturedPost {currentPost} />
  </div>
</div>
<!-- <img src="images/DIDO_WEB.jpg" alt="featured" style="margin-bottom: 2.5em;" />
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/asEvnIJ7GfA"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
/> -->
