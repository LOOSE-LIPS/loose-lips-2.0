/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { IBlog } from "$lib/models/interfaces/iblog.interface";
import { slugFromPath } from "$utils/slug-from-path";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({
  query,
}: {
  query: URLSearchParams;
}): Promise<Partial<{ body: IBlog[]; status: number }>> {
  const modules = import.meta.glob(
    "../../lib/markupfiles/crew/**/index.{md,svx,svelte.md}"
  );

  const crewPromises = [];

  for (const [path, resolver] of Object.entries(modules)) {
    const slug = slugFromPath(path);
    const promise = resolver().then((post) => {
      return { slug, ...post.metadata };
    });

    crewPromises.push(promise);
  }

  const crew = await Promise.all(crewPromises);
  const publishedCrewMembers = crew.filter((post) => post.published);

  return {
    body: publishedCrewMembers,
    status: 200,
  };
}
