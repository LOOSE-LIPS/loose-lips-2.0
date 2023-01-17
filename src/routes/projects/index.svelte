<script lang="ts" context="module">
	import { browser, dev } from '$app/env';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;
</script>

<script lang="ts">
	// Start: Local Imports
	// Components
	import HeadTags from '$components/head-tags/HeadTags.svelte';
	import ExternalLink from '$ui/components/external-link/ExternalLink.svelte';
	import ProjectCard from '$components/project-card/ProjectCard.svelte';

	// Models
	import type { IMetaTagProperties } from '$models/interfaces/imeta-tag-properties.interface';
	import type { IProjectCard } from '$models/interfaces/iproject-card.interface';
	// End: Local Imports

	// Start: Local component properties
	/**
	 * @type {IMetaTagProperties}
	 */
	const metaData: Partial<IMetaTagProperties> = {
		title: 'Project | Sveltekit Blog',
		description: 'Project page of Sveltekit blog starter project',
		url: '/projects',
		keywords: ['sveltekit', 'sveltekit starter', 'sveltekit starter about'],
		searchUrl: '/projects',
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



	// End: Local component properties
</script>

<!-- Start: Header Tag -->
<HeadTags metaData="{metaData}" />
<!-- End: Header Tag -->

<!-- Start: Project page section -->
<div class="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
	<h1 class="font-bold text-3xl md:text-5xl tracking-tight mb-4 dark:text-white"> Coming soon... </h1>
</div>
<!-- End: Project page section -->
