<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    return {
      props: {
        labels: await fetch("/labels.json").then((res) => res.json()),
      },
    };
  }
</script>

<script lang="ts">
  import HeadTags from "$components/head-tags/HeadTags.svelte";
  import LabelPost from "$shared/components/label-post/LabelPost.svelte";

  import type { IBlog } from "$models/interfaces/iblog.interface";
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";

  export let labels!: IBlog[];
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

  let searchValue = "";
  $: filteredLabels = labels
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .filter((label) =>
      label.title.toLowerCase().includes(searchValue.toLowerCase())
    );
</script>

<HeadTags {metaData} />

<div class="pt-[5%]">
  <div class="pl-[5%] pr-[5%] pt-[4%]">
    <h1
      class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black
      dark:text-white"
    >
      Labels
    </h1>
    <div class="mb-4">
      <input
        bind:value={searchValue}
        aria-label="Search Label"
        type="text"
<<<<<<< HEAD
        placeholder="Search labels"
=======
        placeholder="Search Label"
>>>>>>> 2675e7ae7d5a99caf4fd69c4fa5259cb9fb6eb2f
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


    <div class="grid  grid-cols-4 grid-rows-4 justify-between gap-3">
      {#each filteredLabels as label}

        <LabelPost {label} />
      {/each}
    </div>
  </div>
</div>
