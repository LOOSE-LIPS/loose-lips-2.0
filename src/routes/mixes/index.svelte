<script lang="ts" context="module">
  import data from "../../../data.json";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    return {
      props: {
        markupMixInfo: await fetch("/mixes.json").then((res) => res.json()),
        mixData: data,
      },
    };
  }
</script>

<script lang="ts">
  import HeadTags from "$components/head-tags/HeadTags.svelte";
  import { player } from "../../stores";

  // Models
  import type { IMix } from "$models/interfaces/imix.interface";
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";

  import MixPost from "$shared/components/mix-post/MixPost.svelte";

  export let markupMixInfo!: IMix[];
  export let mixData;

  // Start: Local component properties
  /**
   * @type {IMetaTagProperties}
   */
  const metaData: Partial<IMetaTagProperties> = {
    title: "Mixes | Sveltekit mixes",
    description: "Mixes page of Sveltekit blog starter project",
    url: "/mixes",
    keywords: ["sveltekit", "sveltekit starter", "sveltekit starter about"],
    searchUrl: "/mixes",
  };

  const tags = [];
  mixData.map((mix) => {
    tags.push(mix.genre);
  });
  let currTag;
  let filteredTagMixes = [];

  let searchValue = "";
  $: filteredMixes = mixData.filter((mix) => {
    return mix.artist.toLowerCase().includes(searchValue.toLowerCase());
  });
  // $: filterOn = true;

  const filterBytag = (tag) => {
    filteredTagMixes = mixData.filter((mix) => {
      return currTag === mix.genre;
    });
  };
  const handleTagClick = (tag) => {
    currTag = tag;
    filterBytag(tag);
  };
  console.log("test");
</script>

<HeadTags {metaData} />
<div class="pt-[5%]">
  <div class="pl-[25%] pr-[25%] pt-[4%]">
    <h1
      class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"
    >
      Mixes
    </h1>
    <div class="mb-4">
      <input
        bind:value={searchValue}
        aria-label="Search articles"
        type="text"
        placeholder="Search mixes"
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
    <div class="flex flex-row flex-wrap w-full mt-4 items-center">
      {#each tags as tag, index (tag)}
        <button
          on:click={() => {
            handleTagClick(tag);
          }}
          class="text-xl font-bold text-black-400 text-black dark:text-white hover:text-white dark:hover:text-white"
          >{tag.toUpperCase()}</button
        >
        {#if index !== tags.length - 1}
          <p class="mr-2 ml-2 text-black dark:text-white">
            {` • `}
          </p>
        {/if}
      {/each}
    </div>
    <div class="flex flex-col">
      {#if !searchValue && filteredTagMixes.length === 0}
        {#each mixData as mixData}
          <MixPost {mixData} {markupMixInfo} />
        {/each}
      {:else if searchValue}
        {#each filteredMixes as mixData}
          <MixPost {mixData} {markupMixInfo} />
        {/each}
      {:else if filteredTagMixes.length > 0}
        {#each filteredTagMixes as mixData}
          <MixPost {mixData} {markupMixInfo} />
        {/each}
      {/if}
    </div>
  </div>
</div>
