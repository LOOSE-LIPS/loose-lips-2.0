<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    return {
      props: {
        crewMembers: await fetch("/crew.json").then((res) => res.json()),
      },
    };
  }
</script>

<script lang="ts">
  import HeadTags from "$components/head-tags/HeadTags.svelte";

  // Models
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";
  import { convertToSlug } from "$utils/convert-to-slug";
  import CrewPost from "$lib/shared/components/crew-post/CrewPost.svelte";

  export let crewMembers!: IBlog[];
  // Start: Local component properties
  /**
   * @type {IMetaTagProperties}
   */
  const metaData: Partial<IMetaTagProperties> = {
    title: "Crew | Sveltekit Crew",
    description: "Crew page of Sveltekit blog starter project",
    url: "/crew",
    keywords: ["sveltekit", "sveltekit starter", "sveltekit starter about"],
    searchUrl: "/crew",
  };
</script>

<HeadTags {metaData} />
<h1
  class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"
>
  Crew
</h1>
<div class="flex flex-row">
  {#each crewMembers as crewMember, index (crewMember.slug)}
    <CrewPost {crewMember} />
  {/each}
</div>
