import { slugFromPath } from "$utils/slug-from-path";
import type { IMix } from "$models/interfaces/imix.interface";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({
  query,
}: {
  query: URLSearchParams;
}): Promise<Partial<{ body: IMix[]; status: number }>> {
  const modules = import.meta.glob(
    "../../lib/markupfiles/crew/**/index.{md,svx,svelte.md}"
  );

  const mixPromises = [];

  for (const [path, resolver] of Object.entries(modules)) {
    const slug = slugFromPath(path);
    const promise = resolver().then((post) => {
      return { slug, ...post.metadata };
    });

    mixPromises.push(promise);
  }

  const crew = await Promise.all(mixPromises);
  const publishedMixes = crew.filter((post) => post.published);

  return {
    body: publishedMixes,
    status: 200,
  };
}
