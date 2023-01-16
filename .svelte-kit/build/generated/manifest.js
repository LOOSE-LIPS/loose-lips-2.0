const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../../../src/routes/__error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/dashboard/index.svelte"),
	() => import("../../../src/routes/projects/index.svelte"),
	() => import("../../../src/routes/snippets/index.svelte"),
	() => import("../../../src/routes/snippets/yet-another-snippet/index.md"),
	() => import("../../../src/routes/snippets/second-snippet/index.md"),
	() => import("../../../src/routes/snippets/first-snippet/index.md"),
	() => import("../../../src/routes/about/index.svelte"),
	() => import("../../../src/routes/blog/index.svelte"),
	() => import("../../../src/routes/blog/yet-another-blog-post/index.md"),
	() => import("../../../src/routes/blog/welcome-to-my-blog/index.md"),
	() => import("../../../src/routes/blog/a-second-post/index.md"),
	() => import("../../../src/routes/blog/first-post/index.md"),
	() => import("../../../src/routes/tags/index.svelte"),
	() => import("../../../src/routes/tags/[tag]/index.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/dashboard/index.svelte
	[/^\/dashboard\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/projects/index.svelte
	[/^\/projects\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/snippets/index.json.ts
	[/^\/snippets\.json$/],

	// src/routes/snippets/index.svelte
	[/^\/snippets\/?$/, [c[0], c[5]], [c[1]]],

	// src/routes/snippets/yet-another-snippet/index.md
	[/^\/snippets\/yet-another-snippet\/?$/, [c[0], c[6]], [c[1]]],

	// src/routes/snippets/second-snippet/index.md
	[/^\/snippets\/second-snippet\/?$/, [c[0], c[7]], [c[1]]],

	// src/routes/snippets/first-snippet/index.md
	[/^\/snippets\/first-snippet\/?$/, [c[0], c[8]], [c[1]]],

	// src/routes/about/index.svelte
	[/^\/about\/?$/, [c[0], c[9]], [c[1]]],

	// src/routes/blog/index.json.ts
	[/^\/blog\.json$/],

	// src/routes/blog/index.svelte
	[/^\/blog\/?$/, [c[0], c[10]], [c[1]]],

	// src/routes/blog/yet-another-blog-post/index.md
	[/^\/blog\/yet-another-blog-post\/?$/, [c[0], c[11]], [c[1]]],

	// src/routes/blog/welcome-to-my-blog/index.md
	[/^\/blog\/welcome-to-my-blog\/?$/, [c[0], c[12]], [c[1]]],

	// src/routes/blog/a-second-post/index.md
	[/^\/blog\/a-second-post\/?$/, [c[0], c[13]], [c[1]]],

	// src/routes/blog/first-post/index.md
	[/^\/blog\/first-post\/?$/, [c[0], c[14]], [c[1]]],

	// src/routes/tags/index.svelte
	[/^\/tags\/?$/, [c[0], c[15]], [c[1]]],

	// src/routes/tags/[tag]/index.svelte
	[/^\/tags\/([^/]+?)\/?$/, [c[0], c[16]], [c[1]], (m) => ({ tag: d(m[1])})],

	// src/routes/api/now-playing/index.json.ts
	[/^\/api\/now-playing\.json$/],

	// src/routes/api/top-tracks/index.json.ts
	[/^\/api\/top-tracks\.json$/],

	// src/routes/api/github/index.json.ts
	[/^\/api\/github\.json$/]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];