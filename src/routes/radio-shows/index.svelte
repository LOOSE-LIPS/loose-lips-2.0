<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    return {
      props: {
        radioShows: await fetch("/radio-shows.json").then((res) => res.json()),
      },
    };
  }
</script>

<script lang="ts">
  import HeadTags from "$components/head-tags/HeadTags.svelte";
  import Button from "$shared/ui/components/button/Button.svelte";

  import type { IMix } from "$lib/models/interfaces/imix.interface";
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";
  import RadioShowPost from "$shared/components/radioshow-post/RadioShowPost.svelte";

  export let radioShows!: any;

  /**
   * @type {IMetaTagProperties}
   */
  const metaData: Partial<IMetaTagProperties> = {
    title: "Labels | Sveltekit Label",
    description: "Labels page of Sveltekit blog starter project",
    url: "/labels",
    keywords: ["labels"],
    searchUrl: "/labels",
  };

  const tags = radioShows
    .map((x) => x.tags)
    .filter((x) => x.trim())
    .reduce((a, b) => (a.includes(b) ? a : [...a, b]), []);

  let visible = radioShows.sort(
    (a, b) => Number(new Date(b.date)) - Number(new Date(a.date))
  );

  let selectedTags = [];

  let searchValue = "";

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter((x) => x !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
    visible = radioShows
      .filter((x) => {
        if (selectedTags.length === 0) return true;
        return selectedTags.includes(x.tags);
      })
      .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));
  };
</script>

<HeadTags {metaData} />

<div class="pt-[5%]">
  <div class="pl-[5%] pr-[5%] pt-[4%]">
    <h1
      class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black
        dark:text-white"
    >
      Radio Shows
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
    <div
      class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 justify-between gap-5 "
    />

    <div class="flex flex-row flex-wrap w-full mt-4 items-center">
      {#each tags as tag, index (tag)}
        <Button
          {tag}
          onClick={() => handleTagClick(tag)}
          active={selectedTags.includes(tag)}
        />
        {#if index !== tags.length - 1}
          <p class="mr-2 ml-2 text-black dark:text-white">
            {` • `}
          </p>
        {/if}
      {/each}
    </div>

    <div class="grid  grid-cols-4 grid-rows-4 justify-between gap-3">
      {#each visible as showData}
        <RadioShowPost {showData} />
      {/each}
    </div>
  </div>
</div>
