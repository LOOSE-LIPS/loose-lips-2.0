<script lang="ts">
  import HeadTags from "$components/head-tags/HeadTags.svelte";
  import RecommendedPostContainer from "$lib/shared/components/recommended-posts/RecommendedPostsContainer.svelte";

  import { blogTypeDate } from "$utils/date-formatters";

  export let blogs;
  export let tags = [];
  export let title = "";
  export let slug = "";
  export let description = "";
  export let date = "";
  export let author = "";

  /**
   * @type {IMetaTagProperties}
   */
  let metaData = {
    title: `${title} | Sveltekit`,
    description: `${description}`,
    url: `/blog/${slug}`,
    keywords: [
      "sveltekit blog",
      "sveltekit starter",
      "svelte starter",
      "svelte",
      ...tags,
    ],
    tags: tags,
    searchUrl: `/blog/${slug}`,
    image: `/images/blogs/${slug}/banner.jpg`,
    twitter: {
      label1: "Written by",
      data1: author,
      label2: "Published on",
      data2: blogTypeDate(date),
    },
    openGraph: {
      type: "article",
    },
  };

  $: {
    if (title && slug) {
      metaData = {
        title: `${title} | Sveltekit`,
        url: `/blog/${slug}`,
        keywords: [
          "sveltekit blog",
          "sveltekit starter",
          "svelte starter",
          "svelte",
          ...tags,
        ],
        tags: tags,
        searchUrl: `/blog/${slug}`,
        description: `${description}`,
        image: `/images/blogs/${slug}/banner.jpg`,
        twitter: {
          label1: "Written by",
          data1: author,
          label2: "Published on",
          data2: blogTypeDate(date),
        },
        openGraph: {
          type: "article",
        },
      };
    }
  }
</script>

<HeadTags {metaData} />

<article
  class="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16 w-full"
>
  <div class="prose dark:prose-dark max-w-none w-full mt-40" id="blog-conent">
    <slot />
  </div>
</article>
<div class="flex flex-col justify-center items-start  mx-auto mb-16 w-full">
  <RecommendedPostContainer {tags} />
</div>
