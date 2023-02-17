<script lang="ts">
  import HeadTags from "$components/head-tags/HeadTags.svelte";
  import ExternalLink from "$ui/components/external-link/ExternalLink.svelte";

  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";
  /**
   * @type {IMetaTagProperties}
   */
  const metaData: Partial<IMetaTagProperties> = {
    title: "About | Sveltekit Blog",
    description: "About page of Sveltekit blog starter project",
    url: "/about",
    keywords: ["sveltekit", "sveltekit starter", "sveltekit starter about"],
    searchUrl: "/about",
  };
</script>

<HeadTags {metaData} />

<div class="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
  <h1
    class="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white"
  >
    Coming soon
  </h1>
</div>
<!-- End: About page section -->
