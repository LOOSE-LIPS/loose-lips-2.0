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

  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";
  import { convertToSlug } from "$utils/convert-to-slug";
  import CrewPost from "$lib/shared/components/crew-post/CrewPost.svelte";

  export let crewMembers!: IBlog[];
  /**
   * @type {IMetaTagProperties}
   */
  const metaData: Partial<IMetaTagProperties> = {
    title: "Crew | Sveltekit Crew",
    description: "Crew page of Sveltekit blog starter project",
    url: "/crew",
    keywords: ["about"],
    searchUrl: "/crew",
  };

  let searchValue = "";
  $: filteredCrewMembers = crewMembers
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .filter((crewMember) =>
      crewMember.title.toLowerCase().includes(searchValue.toLowerCase())
    );

  console.log(crewMembers, "CREW");
</script>

<HeadTags {metaData} />

<div class="pt-[5%]">
  <div class="pl-[25%] pr-[25%] pt-[4%]">
    <h1
      class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black
    dark:text-white"
    >
      Crew
    </h1>
    <div class="mb-4">
      <input
        bind:value={searchValue}
        aria-label="Search articles"
        type="text"
        placeholder="Search Crew members"
        class="px-4 py-2 border border-gray-300 dark:border-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <svg
        class="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <div class="flex flex-row ">
      {#if !searchValue}
        {#each crewMembers as crewMember, index (crewMember.slug)}
          <CrewPost {crewMember} />
        {/each}
      {:else if filteredCrewMembers.length === 0}
        <p class="text-gray-600 dark:text-gray-400 mb-4">No posts found.</p>
      {:else}
        {#each filteredCrewMembers as crewMember, index (crewMember.slug)}
          <CrewPost {crewMember} />
        {/each}
      {/if}
    </div>
  </div>
</div>
