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
  import BlogPost from "$components/blog-post/BlogPost.svelte";

  // Models
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";
  import { convertToSlug } from "$utils/convert-to-slug";

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
    searchUrl: "/blog",
  };
</script>

<HeadTags {metaData} />

{#each crewMembers as crewMember}
  <h1>{crewMember.title}</h1>
{/each}
