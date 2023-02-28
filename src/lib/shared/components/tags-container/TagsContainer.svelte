<script lang="ts">
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import { convertToSlug } from "$utils/convert-to-slug";
  import Button from "$shared/ui/components/button/Button.svelte";
  export let tags;

  let listWithDuplicatetags: string[] = [];
</script>

<div class="flex flex-row flex-wrap w-full mt-4 items-center">

  {#each tags as tag, index (tag)}

    <a
      data-sveltekit:prefetch
      aria-label={tag}
      class="text-xl font-bold text-black-400 text-black dark:text-white hover:text-white dark:hover:text-whiste"
    >
      {tag.toUpperCase()}
    </a>
    {#if index !== tags.length - 1}
      <p class="mr-2 ml-2 text-black dark:text-white p-2 text-align:center text-xl">
        {` • `}
      </p>
    {/if}
  {/each}
</div>
