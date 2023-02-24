<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    return {
      props: {
        mixData: await fetch("/mixes.json").then((res) => res.json()),
      },
    };
  }
</script>

<script lang="ts">
  import HeadTags from "$components/head-tags/HeadTags.svelte";
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";
  import MixPost from "$shared/components/mix-post/MixPost.svelte";
  import Button from "$shared/ui/components/button/Button.svelte";
  export let mixData;
  /**
   * @type {IMetaTagProperties}
   */
  const metaData: Partial<IMetaTagProperties> = {
    title: "Mixes",
    description: "Mixes page",
    url: "/mixes",
    keywords: ["mixes"],
    searchUrl: "/mixes",
  };

  let tags = [];
  let currTags = [];
  let filteredMixes = mixData;
  mixData.map((mix) => {
    return tags.includes(mix.tags.toLowerCase())
      ? tags
      : tags.push(mix.tags.toLowerCase());
  });
  let searchValue = "";

  const handleTagClick = (tag) => {
    currTags.includes(tag.toLowerCase())
      ? currTags.splice(currTags.indexOf(tag.toLowerCase()))
      : currTags.push(tag.toLowerCase());
    filteredMixes =
      currTags.length === 0
        ? mixData
        : mixData.filter((mix) => {
            return currTags.includes(mix.tags.toLowerCase());
          });
    console.log(currTags);
    console.log(filteredMixes);
  };
</script>

<HeadTags {metaData} />
<div class="pt-[5%]">
  <div class="pl-[5%] pr-[10%] pt-[4%]">
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
        <Button {tag} {handleTagClick} />
        {#if index !== tags.length - 1}
          <p class="mr-2 ml-2 text-black dark:text-white">
            {` • `}
          </p>
        {/if}
      {/each}
    </div>

    <div class="grid  grid-cols-2 grid-rows-4 justify-between gap-3">
      {#each filteredMixes as mixData}
        <MixPost {mixData} />
      {/each}
    </div>
  </div>
</div>
