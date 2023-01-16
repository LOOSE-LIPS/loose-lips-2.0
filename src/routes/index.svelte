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
	// Start: External Imports
	// End: External Imports

	// Start: Svelte Imports
	// End: Svelte Imports

	// Start: Local Imports

	// Core services

	// Utils

	// Components
	import HeadTags from '$components/head-tags/HeadTags.svelte';
	import BlogPost from '$components/blog-post/BlogPost.svelte';
	import ProjectCard from '$components/project-card/ProjectCard.svelte';

	// Models
	import type { IMetaTagProperties } from '$models/interfaces/imeta-tag-properties.interface';
	import type { IProjectCard } from '$models/interfaces/iproject-card.interface';
	import type { IBlog } from '$models/interfaces/iblog.interface';
	import type { IModernImage } from '$models/interfaces/imodern-image.interface'
	// End: Local Imports

	// Exports
	export let blogs!: IBlog[];
	// Start: Local component properties
	/**
	 * @type {IMetaTagProperties}
	 */
	const metaData: Partial<IMetaTagProperties> = {
		title: `LOOSE LIPS | Live`,
		description:
			'Loose lips label radio and blogging website).',
		keywords: ['radio', 'mixes', 'london radio', 'music'],
	};



	const projects: IProjectCard[] = [
		{
			title: 'Sveltekit Starter',
			description:
				'Sveltekit starter project created with sveltekit, typescript, tailwindcss, postcss, husky, and storybook. The project has the structure set up for the scaleable web application.',
			slug: 'https://github.com/navneetsharmaui/sveltekit-starter',
			icon: '',
		},
		{
			title: 'Sveltekit Blog',
			description:
				'Sveltekit Blog starter project created with sveltekit, typescript, tailwindcss, postcss, husky, and storybook. The project has the structure set up for the scaleable web application and blog.',
			slug: 'https://github.com/navneetsharmaui/sveltekit-blog',
			icon: '',
		},
		{
			title: 'Sveltekit Starter',
			description:
				'Sveltekit starter project created with sveltekit, typescript, tailwindcss, postcss, husky, and storybook. The project has the structure set up for the scaleable web application.',
			slug: 'https://github.com/navneetsharmaui/sveltekit-starter',
			icon: '',
		},
		{
			title: 'Sveltekit Blog',
			description:
				'Sveltekit Blog starter project created with sveltekit, typescript, tailwindcss, postcss, husky, and storybook. The project has the structure set up for the scaleable web application and blog.',
			slug: 'https://github.com/navneetsharmaui/sveltekit-blog',
			icon: 'mosh3.jpg',
		},
	];
	// End: Local component properties

	// Start: Local component methods

	// End: Local component methods
</script>

<!-- Start: Header Tag -->
<HeadTags metaData="{metaData}" />
<!-- End: Header Tag -->

<div class="perspective-text">

	<div class="perspective-line">
	  <p style="margin-left: 23px;">LOOSE </p>
	</div>
	<div class="perspective-line">
	  <p style="margin-left: 56px;">LIPS</p>
	</div>
	<div class="perspective-line">
	  <p style="margin-left: 14px;">2.0</p>
	</div>
	
  </div>
<!-- Start: Home Page container -->

<div class="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
<!-- <div class="audio" style="position:fixed;left:0;bottom:0;width:;">
	<Aplayer audio={
		{name:'君の知らない物語',
		artist: 'supercell',
		cover: 'https://blog-static.fengkx.top/svelte-aplayer/bakemonogatari-ed.jpg',
		url: "https://blog-static.fengkx.top/svelte-aplayer/bakemonogatari-ed.mp3"}} />

</div> -->

	
	<img src="logo-loose-lips.gif" alt="" style="margin-top: -2vh;">

	<a href="#featured" style="
width: 0;
height: 0;
border-left: 40px solid transparent;
border-right: 40px solid transparent;
border-top: 25px solid #8ef6cf;
display: block;
margin:auto;
margin-top:5%;
color: white
transform: translate(-50%, 0px);">
</a>
<p class="font-bold text-2xl text-white text-center" style="margin: auto;transform: rotate(-15deg);" >HAVE A LOOKSY</p>
<h2 id="featured" class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white" style="margin-top: 5em;"> Featured </h2>
<img src="DIDO_WEB.jpg" alt="featured">


		<!-- Start: Top Projects -->
		<h2 class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"> Mix Series </h2>

		{#if projects.length > 0}
			{#each projects as project}
				<ProjectCard project="{project}" />
			{/each}
		{/if}
		<a href="tags/react" class="viewAll">
			<p class="font-italic text-m text-white">View all</p>
		</a>
		
		<!-- End: Top Projects -->


		<!-- Start: Top Projects -->
		<h2 class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"> Radio Series </h2>

		{#if projects.length > 0}
			{#each projects as project}
				<ProjectCard project="{project}" />
			{/each}
		{/if}
		<a href="tags/react" class="viewAll">
			<p class="font-italic text-m text-white">View all</p>
		</a>
		<!-- End: Top Projects -->

			<!-- Start: Popular Blog Section -->
	<h2 class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em" style="margin-top: 15%;"> Recent Posts </h2>

	{#if blogs.length > 0}
		{#each blogs as blog, index (blog.slug)}
			<BlogPost blog="{blog}" />
		{/each}
	{/if}
	<!-- End: Popular Blog Section -->


</div>
<!-- End: Home Page container -->

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
}
.perspective-line {
  height: 1.4em;
  overflow-x: hidden !important;
  position:static;
}

.viewAll:hover{
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
.perspective-line:hover p{
  transform: translate(0, -50px);
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
.perspective-line:hover p{
  transform: translate(0, -50px);
}
p {
  transition: all 0.5s ease-in-out;
}
body{
	
}

</style>