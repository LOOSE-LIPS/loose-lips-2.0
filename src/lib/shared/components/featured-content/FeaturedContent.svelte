<script lang="ts">
  //   import type { IBlog } from "$models/interfaces/iblog.interface";
  import BlogPost from "$components/blog-post/BlogPost.svelte";
  export let featuredBlogs;
</script>

<h2
  id="featured"
  class="font-bold text-2xl md:text-4xl tracking-tight mb-4 max-w-5xl text-black dark:text-white"
>
  Featured
</h2>
{#each featuredBlogs as blog}
  <BlogPost {blog} />
{/each}
<img src="images/DIDO_WEB.jpg" alt="featured" style="margin-bottom: 2.5em;" />
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/asEvnIJ7GfA"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
/>
