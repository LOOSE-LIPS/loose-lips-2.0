<script lang="ts" context="module">
  import { browser, dev } from "$app/env";

  // we don't need any JS on this page, though we'll load
  // it in dev so that we get hot module replacement...
  export const hydrate = dev;

  // ...but if the client-side router is already loaded
  // (i.e. we came here from elsewhere in the app), use it
  export const router = browser;

  // since there's no dynamic data here, we can prerender
  // it so that it gets served as a static asset in prod
  export const prerender = true;
</script>

<script lang="ts">
  import HeadTags from "$components/head-tags/HeadTags.svelte";
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";

  /**
   * @type {IMetaTagProperties}
   */
  const metaData: Partial<IMetaTagProperties> = {
    title: "Project | Sveltekit Blog",
    description: "Project page of Sveltekit blog starter project",
    url: "/projects",
    keywords: ["sveltekit", "sveltekit starter", "sveltekit starter about"],
    searchUrl: "/projects",
  };
</script>

<HeadTags {metaData} />
<div class="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
  <h1
    class="font-bold text-3xl md:text-5xl tracking-tight mb-4 dark:text-white"
  >
    Coming soon...
  </h1>
</div>
