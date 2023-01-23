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

  const crewPromises = [];

  for (const [path, resolver] of Object.entries(modules)) {
    const slug = slugFromPath(path);
    const promise = resolver().then((post) => {
      return { slug, ...post.metadata };
    });

    crewPromises.push(promise);
  }

  const posts = await Promise.all(crewPromises);
  const publishedCrewMembers = posts.filter((post) => post.published);

  publishedCrewMembers.sort((a, b) =>
    new Date(a.date) > new Date(b.date) ? -1 : 1
  );

  return {
    body: publishedCrewMembers,
    status: 200,
  };
}
