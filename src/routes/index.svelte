<!-- HOME PAGE OF WEBSITE






 -->
<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    return {
      props: {
        blogs: await fetch(`/blog.json?recent=${5}`).then((res) => res.json()),
      },
    };
  }
</script>

<script lang="ts">
  // Imports

  // Components
  import HeadTags from "$components/head-tags/HeadTags.svelte";
  import BlogPost from "$components/blog-post/BlogPost.svelte";
  import ProjectCard from "$components/project-card/ProjectCard.svelte";
  import FeaturedContent from "$components/featured-content/FeaturedContent.svelte";

  // Models
  import type { IMetaTagProperties } from "$models/interfaces/imeta-tag-properties.interface";
  import type { IProjectCard } from "$models/interfaces/iproject-card.interface";
  import type { IBlog } from "$models/interfaces/iblog.interface";
  import { LoggerUtils } from "$lib/utils/logger";
  import { convertToSlug } from "$utils/convert-to-slug";

  // Exports
  export let blogs!: IBlog[];

  // Add metatags for page
  /**
   * @type {IMetaTagProperties}
   */
  const metaData: Partial<IMetaTagProperties> = {
    title: `LOOSE LIPS | Live`,
    description: "Loose lips label radio and blogging website).",
    keywords: ["radio", "mixes", "london radio", "music"],
  };

  // EVENTS DATA
  const events: IProjectCard[] = [
    {
      title: "Loose Lips presents: Sunil Sharpe, Cersy & Kortzer",
      description:
        "Loose Lips brings the legendary Irish turntablist Sunil Sharpe to an exciting new Manchester spot fitted with a beautiful Danley soundsystem. Supported by up and coming techno talent Cersy, and Loose Lips resident Kortzer.",
      slug: "https://github.com/navneetsharmaui/sveltekit-starter",
      img:
        "https://imgproxy.ra.co/_/quality:66/w:1500/rt:fill/aHR0cHM6Ly9pbWFnZXMucmEuY28vODkxMjlmZGEzN2EzZjIxMDEwOTg1YzZiZmNmNjVjZDFlMGI1ZWIwYi5wbmc=",
      icon: "",
      date: "28/01/2023",
    },
  ];

  const mostRecentBlogs: IBlog[] = blogs
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .slice(0, 3);

  let searchValue = "";
  $: filteredBlogPosts = blogs
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchValue.toLowerCase())
    );

  // End: Local component properties

  // Local Methods

  let listWithDuplicatetags: string[] = [];

  blogs.forEach((blog) => {
    listWithDuplicatetags =
      listWithDuplicatetags.length === 0
        ? [...blog.tags]
        : [...listWithDuplicatetags, ...blog.tags];
  });
  $: tags = [...new Set(listWithDuplicatetags)];

  const featuredBlogs: IBlog[] = blogs.filter((blog) => {
    return blog.featured;
  });
</script>

<!-- Start: Header Tag -->
<HeadTags {metaData} />
<!-- End: Header Tag -->

<div class="perspective-text">
  <div class="perspective-line">
    <p style="margin-left: 23px;" class="text-black dark:text-white">LOOSE</p>
  </div>
  <div class="perspective-line">
    <p style="margin-left: 56px;" class="text-black dark:text-white">LIPS</p>
  </div>
  <div class="perspective-line">
    <p style="margin-left: 14px;" class="text-black dark:text-white">2.0</p>
  </div>
</div>
<!-- Start: Home Page container -->

<div
  class="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16 hover:transform-rotate(4deg)"
>
  <img src="images/logo-loose-lips.gif" alt="" style="margin-top: -2vh;" />

  <a
    href="#featured"
    style="
width: 0;
height: 0;
border-left: 40px solid transparent;
border-right: 40px solid transparent;
border-top: 25px solid #8ef6cf;
display: block;
margin:auto;
margin-top:5%;
color: white;
z-index:15;
transform: translate(-50%, 0px);"
  />
  <p
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white"
    style="margin: auto;transform: rotate(-15deg);"
  >
    HAVE A LOOKSY
  </p>
</div>
<div class="p-5">
  <FeaturedContent {featuredBlogs} />
</div>
<div class="flex flex-row flex-wrap w-full mt-4 items-center">
  {#each tags as tag, index (tag)}
    <a
      data-sveltekit:prefetch
      href={`/tags/${convertToSlug(tag)}`}
      aria-label={tag}
      class="text-xl font-bold text-black-400 text-black dark:text-white hover:text-white dark:hover:text-white"
    >
      {tag.toUpperCase()}
    </a>
    {#if index !== tags.length - 1}
      <p class="mr-2 ml-2 text-black dark:text-white">
        {` • `}
      </p>
    {/if}
  {/each}
</div>
<div
  class="flex flex-row justify-center items-start max-w-6xl mx-auto mb-16 hover:transform-rotate(4deg)"
>
  <!-- Start: Popular Blog Section -->
  <h2
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em"
    style="margin-top: 15%;"
  >
    Recent Posts
  </h2>
  <div />
  {#if blogs.length > 0}
    {#each blogs as blog, index (blog.slug)}
      <div class="p-5">
        <BlogPost {blog} />
      </div>
    {/each}
  {/if}
  <!-- End: Popular Blog Section -->
</div>

<div
  class="flex flex-row justify-center items-start max-w-6xl mx-auto mb-16 hover:transform-rotate(4deg)"
>
  <!-- Start: Popular Blog Section -->
  <h2
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em"
  >
    Editorial Posts
  </h2>
  <div />
  {#if blogs.length > 0}
    {#each blogs as blog, index (blog.slug)}
      <div class="p-5">
        <BlogPost {blog} />
      </div>
    {/each}
  {/if}
  <!-- End: Popular Blog Section -->
</div>

<div class="flex flex-row justify-left items-start max-w-2xl mx-auto">
  <div class="p-5">
    <!-- Start: Events -->
    <h2
      class="font-bold text-2xl md:text-2xl tracking-tight mb-2 max-w-1xl text-black dark:text-white"
    >
      Upcoming Events
    </h2>
    {#if events.length > 0}
      {#each events as event}
        <ProjectCard project={event} />
      {/each}
    {/if}
    <a href="events" class="viewAll">
      <p class="font-italic text-m text-white">View past events</p>
    </a>
    <!-- End: Top Events -->
  </div>
</div>
<!-- End: Home Page container -->

<!-- Old code for audio player
	<div class="audio" style="position:fixed;left:0;bottom:0;width:;">
	<Aplayer audio={
		{name:'君の知らない物語',
		artist: 'supercell',
		cover: 'https://blog-static.fengkx.top/svelte-aplayer/bakemonogatari-ed.jpg',
		url: "https://blog-static.fengkx.top/svelte-aplayer/bakemonogatari-ed.mp3"}} />

</div> -->
<style>
  .perspective-text {
    color: white;
    font-family: Arial;
    font-size: 12.2em;
    font-weight: 900;
    letter-spacing: -8px;
    text-transform: uppercase;
    perspective: 23rem;
    z-index: 10;
    position: absolute;
    margin-left: 1.5em;
  }
  .perspective-line {
    height: 1.4em;
    overflow-x: hidden !important;
    position: static;
  }

  .viewAll:hover {
    text-decoration: underline;
  }

  p {
    margin: 0;
    height: 1.4em;
    line-height: 1.4em;
    transition: all 0.5s ease-in-out;
  }
  .perspective-line {
    height: 1.4em;
    position: static;
    overflow-x: hidden;
  }
  p {
    margin: 0;
    height: 1.4em;
    line-height: 1.4em;
    transition: all 0.5s ease-in-out;
  }
  .perspective-line {
    position: static;
    overflow-x: hidden !important;
  }
  .perspective-line:hover p {
    transform: translate(0, -50px);
    transform: rotate(4deg);
  }
  .perspective-line:nth-child(1) {
    left: 29px;
  }
  .perspective-line:nth-child(2) {
    left: 58px;
  }
  .perspective-line:nth-child(3) {
    left: 87px;
  }
  .perspective-line:nth-child(4) {
    left: 116px;
  }
  .perspective-line:nth-child(5) {
    left: 145px;
  }
  .perspective-line:hover p {
    transform: translate(0, -50px);
  }
  p {
    transition: all 0.5s ease-in-out;
  }
  :global(body) {
    /* this will apply to <body> */
    background-image: radial-gradient(black 1px, transparent 0);
    background-size: 40px 40px;
    background-position: -19px -19px;
  }
</style>
