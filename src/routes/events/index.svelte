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
	import HeadTags from '$components/head-tags/HeadTags.svelte';
	import ProjectCard from '$components/project-card/ProjectCard.svelte';

	// Models
	import type { IMetaTagProperties } from '$models/interfaces/imeta-tag-properties.interface';
	import type { IProjectCard } from '$models/interfaces/iproject-card.interface';
  	import { LoggerUtils } from '$lib/utils/logger';

	

	// Add metatags for page
	/**
	 * @type {IMetaTagProperties}
	 */
	const metaData: Partial<IMetaTagProperties> = {
		title: `LOOSE LIPS | Live`,
		description:
			'Loose lips label radio and blogging website).',
		keywords: ['radio', 'mixes', 'london radio', 'music'],
	};

	// EVENTS DATA
	const events: IProjectCard[] = [
		{
			title: 'Loose Lips presents: Sunil Sharpe, Cersy & Kortzer',
			description:
				'Loose Lips brings the legendary Irish turntablist Sunil Sharpe to an exciting new Manchester spot fitted with a beautiful Danley soundsystem. Supported by up and coming techno talent Cersy, and Loose Lips resident Kortzer.',
			slug: 'https://github.com/navneetsharmaui/sveltekit-starter',
			img: 'https://imgproxy.ra.co/_/quality:66/w:1500/rt:fill/aHR0cHM6Ly9pbWFnZXMucmEuY28vODkxMjlmZGEzN2EzZjIxMDEwOTg1YzZiZmNmNjVjZDFlMGI1ZWIwYi5wbmc=',
			icon: '',
			date: '28/01/2023',
		},
	];

</script>

<!-- Start: Header Tag -->
<HeadTags metaData="{metaData}" />
<!-- End: Header Tag -->

<!-- Start: Home Page container -->

<div class="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">

		<!-- Start: Events -->
		<h2 class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"> Upcoming Events </h2>
		{#if events.length > 0}
			{#each events as event}
				<ProjectCard project="{event}" />
			{/each}
		{/if}
		<a href="events" class="viewAll">
			<p class="font-italic text-m text-white">View past events</p>
		</a>

			<!-- Start: Events -->
			<h2 class="font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"> Past Events </h2>
			{#if events.length > 0}
				{#each events as event}
					<ProjectCard project="{event}" />
				{/each}
			{/if}
			<a href="events" class="viewAll">
				<p class="font-italic text-m text-white">View past events</p>
			</a>
	

</div>
