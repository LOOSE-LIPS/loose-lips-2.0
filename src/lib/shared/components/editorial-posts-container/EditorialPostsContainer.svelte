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
  export let blogs!: IBlog[];

  let editorialPosts = blogs.filter((blog) => {
    return blog.featured;
  });
  //   export let featuredBlogs;
</script>

<div
  class="flex flex-col items-start max-w-6xl mx-auto mb-16 hover:transform-rotate(4deg) "
>
  <!-- Start: Popular Blog Section -->
  <h2
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em m-6"
    style="margin-top: 15%;"
  >
    Recommended
  </h2>
  <div />

  {#if blogs.length > 0}
    <div class="grid grid-flow-col auto-cols-max overflow-x-auto max-w-6xl">
      {#each editorialPosts as blog, index (blog.slug)}
        <div
          class="p-4 h-auto  aspect-video object-cover w-[480px] bg-blue-opaque"
        >
          <BlogPost {blog} />
        </div>
      {/each}
    </div>
  {/if}
  <!-- End: Popular Blog Section -->
</div>
