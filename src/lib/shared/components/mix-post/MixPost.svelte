<script lang="ts">
  import type { IMix } from "$models/interfaces/imix.interface";
  import TagsContainer from "$shared/ui/components/tags-container/TagsContainer.svelte";

  /**
   * @type {IMix}
   */
  export let mix: IMix;
</script>

{#if mix && mix?.slug}
  <div class="mb-8 w-full border-b border-gray-100 dark:border-gray-800 pb-5">
    <a data-sveltekit:prefetch href={`/mixes/${mix.slug}`} class="w-full">
      <div class="flex flex-col md:flex-row justify-between">
        <img
          src={mix.banner}
          alt=""
          style="height: 12em;width:18emwidth:100%;"
        />

        <!-- <p class="text-gray-500 text-left md:text-right w-32 mb-4 md:mb-0">
					{`${views ? new Number(views).toLocaleString() : '–––'} views`}
				</p> -->
      </div>
      <iframe
        title=""
        width="10%"
        height="100"
        scrolling="no"
        frameborder="no"
        allow="autoplay"
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/934538197&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false"
      />
      <div
        style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"
      >
        <a
          href="https://soundcloud.com/loose-lips123"
          title="Loose Lips"
          target="_blank"
          style="color: #cccccc; text-decoration: none;">Loose Lips</a
        >
        ·
        <a
          href="https://soundcloud.com/loose-lips123/loose-lips-mix-series-306-ukaea"
          title="Loose Lips Mix Series - 306 - UKAEA"
          target="_blank"
          style="color: #cccccc; text-decoration: none;"
          >Loose Lips Mix Series - 306 - UKAEA</a
        >
      </div>

      <h3
        class="text-lg md:text-xl font-medium mb-2 w-full text-gray-900 dark:text-gray-100"
      >
        {mix.title}
      </h3>
    </a>
    <p class="text-gray-600 dark:text-gray-400">{mix.description}</p>
    <p class="text-gray-600 dark:text-gray-400">{mix.date}</p>
    <TagsContainer tags={mix.tags} />
  </div>
  <!-- <hr class="w-full border-1 border-gray-200 dark:border-gray-800 mb-8" /> -->
{/if}
