import { respond } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths, assets } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "./hooks.js";

const template = ({ head, body }) => "<!DOCTYPE html>\n<html class=\"light\" data-theme=\"light\" lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<meta http-equiv=\"x-ua-compatible\" content=\"IE=edge,chrome=1\" />\n\t\t<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\" />\n\t\t<meta content=\"/browserconfig.xml\" name=\"msapplication-config\">\n\n\t\t<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\" />\n\t\t<meta name=\"theme-color\" content=\"#000\" />\n\t\t<meta content=\"#000\" name=\"msapplication-TileColor\">\n\n\t\t<link rel=\"icon\" type=\"image/x-icon\" href=\"/favicon.ico\" />\n\t\t<link color=\"#fff\" href=\"/favicon.ico\" rel=\"mask-icon\">\n\n\t\t" + head + "\n\t</head>\n\t<body>\n\t\t<div id=\"sveltekit-blog\">" + body + "</div>\n\t</body>\n\t<noscript> Please enable JavaScript to continue using this application. </noscript>\n</html>\n";

let options = null;

const default_settings = { paths: {"base":"","assets":""} };

// allow paths to be overridden in svelte-kit preview
// and in prerendering
export function init(settings = default_settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	const hooks = get_hooks(user_hooks);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: assets + "/_app/start-47f3f05e.js",
			css: [assets + "/_app/assets/start-464e9d0a.css",assets + "/_app/assets/vendor-863873a7.css"],
			js: [assets + "/_app/start-47f3f05e.js",assets + "/_app/chunks/vendor-b3989e7d.js"]
		},
		fetched: undefined,
		floc: false,
		get_component_path: id => assets + "/_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: (error, request) => {
			hooks.handleError({ error, request });
			error.stack = options.get_stack(error);
		},
		hooks,
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		prerender: true,
		read: settings.read,
		root,
		service_worker: null,
		router: true,
		ssr: true,
		target: "#sveltekit-blog",
		template,
		trailing_slash: "never"
	};
}

const d = decodeURIComponent;
const empty = () => ({});

const manifest = {
	assets: [{"file":"browserconfig.xml","size":225,"type":"application/xml"},{"file":"favicon.ico","size":1150,"type":"image/vnd.microsoft.icon"},{"file":"fonts/Raleway-400-normal.woff2","size":11500,"type":"font/woff2"},{"file":"fonts/Raleway-500-normal.woff2","size":9764,"type":"font/woff2"},{"file":"fonts/Raleway-600-normal.woff2","size":7888,"type":"font/woff2"},{"file":"fonts/Raleway-700-normal.woff2","size":10456,"type":"font/woff2"},{"file":"images/.gitkeep","size":0,"type":null},{"file":"images/DIDO_WEB.jpg","size":82364,"type":"image/jpeg"},{"file":"images/author/sveltekit-blogger.svg","size":1721,"type":"image/svg+xml"},{"file":"images/blogs/.gitkeep","size":0,"type":null},{"file":"images/blogs/a-second-post/banner.jpg","size":10117,"type":"image/jpeg"},{"file":"images/blogs/first-post/banner.jpg","size":32521,"type":"image/jpeg"},{"file":"images/blogs/welcome-to-my-blog/banner.jpg","size":41430,"type":"image/jpeg"},{"file":"images/blogs/yet-another-blog-post/banner.jpg","size":38596,"type":"image/jpeg"},{"file":"images/logo-loose-lips.gif","size":2530269,"type":"image/gif"},{"file":"images/snippets/.gitkeep","size":0,"type":null},{"file":"images/snippets/first-snippet/banner.jpg","size":41929,"type":"image/jpeg"},{"file":"images/snippets/second-snippet/banner.jpg","size":45836,"type":"image/jpeg"},{"file":"images/snippets/yet-another-snippet/banner.jpg","size":46961,"type":"image/jpeg"},{"file":"logos/buttondown.png","size":1476,"type":"image/png"},{"file":"logos/css.png","size":1740,"type":"image/png"},{"file":"logos/firebase.png","size":2668,"type":"image/png"},{"file":"logos/google-analytics.png","size":679,"type":"image/png"},{"file":"logos/google-sheets.png","size":1038,"type":"image/png"},{"file":"logos/gumroad.png","size":2618,"type":"image/png"},{"file":"logos/mailchimp.png","size":20649,"type":"image/png"},{"file":"logos/mailgun.png","size":3611,"type":"image/png"},{"file":"logos/mdx.png","size":1320,"type":"image/png"},{"file":"logos/mosh1.gif","size":309649,"type":"image/gif"},{"file":"logos/react.png","size":2647,"type":"image/png"},{"file":"logos/sendgrid.png","size":404,"type":"image/png"},{"file":"logos/slack.png","size":3489,"type":"image/png"},{"file":"logos/spotify.png","size":2057,"type":"image/png"},{"file":"logos/stripe.png","size":1417,"type":"image/png"},{"file":"logos/youtube.png","size":1112,"type":"image/png"},{"file":"robots.txt","size":77,"type":"text/plain"},{"file":"rss.xml","size":2621,"type":"application/xml"},{"file":"sitemap.xml","size":1971,"type":"application/xml"},{"file":"tailwind.css","size":32411,"type":"text/css"}],
	layout: "src/routes/__layout.svelte",
	error: "src/routes/__error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/dashboard\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/dashboard/index.svelte"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/projects\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/projects/index.svelte"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'endpoint',
						pattern: /^\/snippets\.json$/,
						params: empty,
						load: () => import("../../src/routes/snippets/index.json.ts")
					},
		{
						type: 'page',
						pattern: /^\/snippets\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/snippets/index.svelte"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/snippets\/yet-another-snippet\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/snippets/yet-another-snippet/index.md"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/snippets\/second-snippet\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/snippets/second-snippet/index.md"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/snippets\/first-snippet\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/snippets/first-snippet/index.md"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/events\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/events/index.svelte"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/about\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/about/index.svelte"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'endpoint',
						pattern: /^\/blog\.json$/,
						params: empty,
						load: () => import("../../src/routes/blog/index.json.ts")
					},
		{
						type: 'page',
						pattern: /^\/blog\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/blog/index.svelte"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/blog\/1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/blog/1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022/index.md"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/blog\/elkka-live-at-corsica-studios-090222\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/blog/elkka-live-at-corsica-studios-090222/index.md"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/blog\/sphie-resuscitation-kim-cosmik-remix\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/blog/sphie-resuscitation-kim-cosmik-remix/index.md"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/crew\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/crew/index.svelte"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/tags\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/tags/index.svelte"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/tags\/([^/]+?)\/?$/,
						params: (m) => ({ tag: d(m[1])}),
						a: ["src/routes/__layout.svelte", "src/routes/tags/[tag]/index.svelte"],
						b: ["src/routes/__error.svelte"]
					},
		{
						type: 'endpoint',
						pattern: /^\/api\/now-playing\.json$/,
						params: empty,
						load: () => import("../../src/routes/api/now-playing/index.json.ts")
					},
		{
						type: 'endpoint',
						pattern: /^\/api\/top-tracks\.json$/,
						params: empty,
						load: () => import("../../src/routes/api/top-tracks/index.json.ts")
					},
		{
						type: 'endpoint',
						pattern: /^\/api\/github\.json$/,
						params: empty,
						load: () => import("../../src/routes/api/github/index.json.ts")
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, resolve }) => resolve(request)),
	handleError: hooks.handleError || (({ error }) => console.error(error.stack)),
	externalFetch: hooks.externalFetch || fetch
});

const module_lookup = {
	"src/routes/__layout.svelte": () => import("../../src/routes/__layout.svelte"),"src/routes/__error.svelte": () => import("../../src/routes/__error.svelte"),"src/routes/index.svelte": () => import("../../src/routes/index.svelte"),"src/routes/dashboard/index.svelte": () => import("../../src/routes/dashboard/index.svelte"),"src/routes/projects/index.svelte": () => import("../../src/routes/projects/index.svelte"),"src/routes/snippets/index.svelte": () => import("../../src/routes/snippets/index.svelte"),"src/routes/snippets/yet-another-snippet/index.md": () => import("../../src/routes/snippets/yet-another-snippet/index.md"),"src/routes/snippets/second-snippet/index.md": () => import("../../src/routes/snippets/second-snippet/index.md"),"src/routes/snippets/first-snippet/index.md": () => import("../../src/routes/snippets/first-snippet/index.md"),"src/routes/events/index.svelte": () => import("../../src/routes/events/index.svelte"),"src/routes/about/index.svelte": () => import("../../src/routes/about/index.svelte"),"src/routes/blog/index.svelte": () => import("../../src/routes/blog/index.svelte"),"src/routes/blog/1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022/index.md": () => import("../../src/routes/blog/1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022/index.md"),"src/routes/blog/elkka-live-at-corsica-studios-090222/index.md": () => import("../../src/routes/blog/elkka-live-at-corsica-studios-090222/index.md"),"src/routes/blog/sphie-resuscitation-kim-cosmik-remix/index.md": () => import("../../src/routes/blog/sphie-resuscitation-kim-cosmik-remix/index.md"),"src/routes/crew/index.svelte": () => import("../../src/routes/crew/index.svelte"),"src/routes/tags/index.svelte": () => import("../../src/routes/tags/index.svelte"),"src/routes/tags/[tag]/index.svelte": () => import("../../src/routes/tags/[tag]/index.svelte")
};

const metadata_lookup = {"src/routes/__layout.svelte":{"entry":"pages/__layout.svelte-9df214d1.js","css":["assets/pages/__layout.svelte-385d5d21.css","assets/vendor-863873a7.css"],"js":["pages/__layout.svelte-9df214d1.js","chunks/vendor-b3989e7d.js","chunks/ExternalLink-f61f9259.js","chunks/environment-ac1cdc6c.js"],"styles":[]},"src/routes/__error.svelte":{"entry":"pages/__error.svelte-8303b3fd.js","css":["assets/pages/__error.svelte-44d0ffb3.css","assets/vendor-863873a7.css"],"js":["pages/__error.svelte-8303b3fd.js","chunks/vendor-b3989e7d.js","chunks/HeadTags-412b7fc4.js","chunks/environment-ac1cdc6c.js"],"styles":[]},"src/routes/index.svelte":{"entry":"pages/index.svelte-699542b8.js","css":["assets/pages/index.svelte-6417d474.css","assets/vendor-863873a7.css"],"js":["pages/index.svelte-699542b8.js","chunks/vendor-b3989e7d.js","chunks/HeadTags-412b7fc4.js","chunks/environment-ac1cdc6c.js","chunks/BlogPost-da6a6125.js","chunks/TagsContainer-2f511c62.js","chunks/convert-to-slug-58a40897.js","chunks/ProjectCard-a3d29106.js","chunks/ExternalLink-f61f9259.js","chunks/logger-5ce91bfc.js"],"styles":[]},"src/routes/dashboard/index.svelte":{"entry":"pages/dashboard/index.svelte-a338066f.js","css":["assets/vendor-863873a7.css"],"js":["pages/dashboard/index.svelte-a338066f.js","chunks/vendor-b3989e7d.js","chunks/ExternalLink-f61f9259.js","chunks/HeadTags-412b7fc4.js","chunks/environment-ac1cdc6c.js"],"styles":[]},"src/routes/projects/index.svelte":{"entry":"pages/projects/index.svelte-89564ec5.js","css":["assets/vendor-863873a7.css"],"js":["pages/projects/index.svelte-89564ec5.js","chunks/vendor-b3989e7d.js","chunks/env-a13806e5.js","chunks/HeadTags-412b7fc4.js","chunks/environment-ac1cdc6c.js","chunks/ExternalLink-f61f9259.js","chunks/ProjectCard-a3d29106.js"],"styles":[]},"src/routes/snippets/index.svelte":{"entry":"pages/snippets/index.svelte-e42d8823.js","css":["assets/vendor-863873a7.css"],"js":["pages/snippets/index.svelte-e42d8823.js","chunks/vendor-b3989e7d.js","chunks/HeadTags-412b7fc4.js","chunks/environment-ac1cdc6c.js"],"styles":[]},"src/routes/snippets/yet-another-snippet/index.md":{"entry":"pages/snippets/yet-another-snippet/index.md-0aafaaae.js","css":["assets/vendor-863873a7.css"],"js":["pages/snippets/yet-another-snippet/index.md-0aafaaae.js","chunks/vendor-b3989e7d.js","chunks/SnippetsLayout-03fc2523.js","chunks/environment-ac1cdc6c.js","chunks/HeadTags-412b7fc4.js","chunks/ExternalLink-f61f9259.js","chunks/reading-time-e91042f0.js"],"styles":[]},"src/routes/snippets/second-snippet/index.md":{"entry":"pages/snippets/second-snippet/index.md-e8d7b3f0.js","css":["assets/vendor-863873a7.css"],"js":["pages/snippets/second-snippet/index.md-e8d7b3f0.js","chunks/vendor-b3989e7d.js","chunks/SnippetsLayout-03fc2523.js","chunks/environment-ac1cdc6c.js","chunks/HeadTags-412b7fc4.js","chunks/ExternalLink-f61f9259.js","chunks/reading-time-e91042f0.js"],"styles":[]},"src/routes/snippets/first-snippet/index.md":{"entry":"pages/snippets/first-snippet/index.md-774c636d.js","css":["assets/vendor-863873a7.css"],"js":["pages/snippets/first-snippet/index.md-774c636d.js","chunks/vendor-b3989e7d.js","chunks/SnippetsLayout-03fc2523.js","chunks/environment-ac1cdc6c.js","chunks/HeadTags-412b7fc4.js","chunks/ExternalLink-f61f9259.js","chunks/reading-time-e91042f0.js"],"styles":[]},"src/routes/events/index.svelte":{"entry":"pages/events/index.svelte-6bd54c19.js","css":["assets/vendor-863873a7.css"],"js":["pages/events/index.svelte-6bd54c19.js","chunks/vendor-b3989e7d.js","chunks/HeadTags-412b7fc4.js","chunks/environment-ac1cdc6c.js","chunks/ProjectCard-a3d29106.js","chunks/ExternalLink-f61f9259.js","chunks/logger-5ce91bfc.js"],"styles":[]},"src/routes/about/index.svelte":{"entry":"pages/about/index.svelte-8937cbcd.js","css":["assets/vendor-863873a7.css"],"js":["pages/about/index.svelte-8937cbcd.js","chunks/vendor-b3989e7d.js","chunks/HeadTags-412b7fc4.js","chunks/environment-ac1cdc6c.js","chunks/ExternalLink-f61f9259.js"],"styles":[]},"src/routes/blog/index.svelte":{"entry":"pages/blog/index.svelte-071c1582.js","css":["assets/vendor-863873a7.css"],"js":["pages/blog/index.svelte-071c1582.js","chunks/vendor-b3989e7d.js","chunks/HeadTags-412b7fc4.js","chunks/environment-ac1cdc6c.js","chunks/BlogPost-da6a6125.js","chunks/TagsContainer-2f511c62.js","chunks/convert-to-slug-58a40897.js"],"styles":[]},"src/routes/blog/1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022/index.md":{"entry":"pages/blog/1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022/index.md-9eefa434.js","css":["assets/vendor-863873a7.css"],"js":["pages/blog/1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022/index.md-9eefa434.js","chunks/vendor-b3989e7d.js","chunks/BlogLayout-c9127499.js","chunks/environment-ac1cdc6c.js","chunks/HeadTags-412b7fc4.js","chunks/ExternalLink-f61f9259.js","chunks/reading-time-e91042f0.js","chunks/TagsContainer-2f511c62.js","chunks/convert-to-slug-58a40897.js"],"styles":[]},"src/routes/blog/elkka-live-at-corsica-studios-090222/index.md":{"entry":"pages/blog/elkka-live-at-corsica-studios-090222/index.md-ffdb4f03.js","css":["assets/vendor-863873a7.css"],"js":["pages/blog/elkka-live-at-corsica-studios-090222/index.md-ffdb4f03.js","chunks/vendor-b3989e7d.js","chunks/BlogLayout-c9127499.js","chunks/environment-ac1cdc6c.js","chunks/HeadTags-412b7fc4.js","chunks/ExternalLink-f61f9259.js","chunks/reading-time-e91042f0.js","chunks/TagsContainer-2f511c62.js","chunks/convert-to-slug-58a40897.js"],"styles":[]},"src/routes/blog/sphie-resuscitation-kim-cosmik-remix/index.md":{"entry":"pages/blog/sphie-resuscitation-kim-cosmik-remix/index.md-8502a9b9.js","css":["assets/vendor-863873a7.css"],"js":["pages/blog/sphie-resuscitation-kim-cosmik-remix/index.md-8502a9b9.js","chunks/vendor-b3989e7d.js","chunks/BlogLayout-c9127499.js","chunks/environment-ac1cdc6c.js","chunks/HeadTags-412b7fc4.js","chunks/ExternalLink-f61f9259.js","chunks/reading-time-e91042f0.js","chunks/TagsContainer-2f511c62.js","chunks/convert-to-slug-58a40897.js"],"styles":[]},"src/routes/crew/index.svelte":{"entry":"pages/crew/index.svelte-3bc3f78a.js","css":["assets/vendor-863873a7.css"],"js":["pages/crew/index.svelte-3bc3f78a.js","chunks/vendor-b3989e7d.js","chunks/env-a13806e5.js","chunks/HeadTags-412b7fc4.js","chunks/environment-ac1cdc6c.js","chunks/ExternalLink-f61f9259.js","chunks/ProjectCard-a3d29106.js"],"styles":[]},"src/routes/tags/index.svelte":{"entry":"pages/tags/index.svelte-043a98c4.js","css":["assets/vendor-863873a7.css"],"js":["pages/tags/index.svelte-043a98c4.js","chunks/vendor-b3989e7d.js","chunks/HeadTags-412b7fc4.js","chunks/environment-ac1cdc6c.js","chunks/convert-to-slug-58a40897.js"],"styles":[]},"src/routes/tags/[tag]/index.svelte":{"entry":"pages/tags/[tag]/index.svelte-c257131a.js","css":["assets/vendor-863873a7.css"],"js":["pages/tags/[tag]/index.svelte-c257131a.js","chunks/vendor-b3989e7d.js","chunks/HeadTags-412b7fc4.js","chunks/environment-ac1cdc6c.js","chunks/BlogPost-da6a6125.js","chunks/TagsContainer-2f511c62.js","chunks/convert-to-slug-58a40897.js"],"styles":[]}};

async function load_component(file) {
	const { entry, css, js, styles } = metadata_lookup[file];
	return {
		module: await module_lookup[file](),
		entry: assets + "/_app/" + entry,
		css: css.map(dep => assets + "/_app/" + dep),
		js: js.map(dep => assets + "/_app/" + dep),
		styles
	};
}

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return respond({ ...request, host }, options, { prerender });
}