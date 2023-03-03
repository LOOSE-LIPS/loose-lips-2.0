/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { IBlog } from "$lib/models/interfaces/iblog.interface";
import { slugFromPath } from "$utils/slug-from-path";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({
  query,
}: {
  query: URLSearchParams;
}): Promise<Partial<{ body: IBlog[]; status: number }>> {
  const modules = import.meta.glob("./**/index.{md,svx,svelte.md}");
  const postPromises = [];
  const limit = Number(query.get("limit") ?? Infinity);
  const recent = Number(query.get("recent") ?? Infinity);

  if (Number.isNaN(limit)) {
    return {
      status: 400,
    };
  }

  if (Number.isNaN(recent)) {
    return {
      status: 400,
    };
  }

  for (const [path, resolver] of Object.entries(modules)) {
    const slug = slugFromPath(path);
    const promise = resolver().then((post) => {
      return { slug, ...post.metadata };
    });

    postPromises.push(promise);
  }

  const sliceParam = query.get("recent") ? recent : limit;

  const events = await Promise.all(postPromises);
  const publishedEvents = events
    .filter((event) => event.published)
    .slice(0, sliceParam);

  publishedEvents.sort((a, b) =>
    new Date(a.date) > new Date(b.date) ? -1 : 1
  );

  return {
    body: publishedEvents.slice(0, sliceParam),
    status: 200,
  };
}
