<script lang="ts">
  import ExternalLink from "$ui/components/external-link/ExternalLink.svelte";

  const linkClass =
    "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-500 transition";
</script>

<footer
  class="flex flex-col justify-center items-start max-w-2xl mx-auto w-full mb-8"
>
  <hr class="w-full border-1 border-gray-200 dark:border-gray-800 mb-8" />
  <slot />
  <div class="w-full max-w-2xl grid grid-cols-1 gap-4 pb-16 sm:grid-cols-3">
    <div class="flex flex-col space-y-4">
      <a
        data-sveltekit:prefetch
        href="/"
        class={linkClass}
        aria-label={"Footer home link"}>Loose Lips</a
      >
      <a
        data-sveltekit:prefetch
        href="/about"
        class={linkClass}
        aria-label={"Footer about link"}
      >
        About
      </a>
      <a
        data-sveltekit:prefetch
        href="/blog"
        class={linkClass}
        aria-label={"Footer about link"}
      >
        Blog
      </a>
      <a
        data-sveltekit:prefetch
        href="/crew"
        class={linkClass}
        aria-label={"Footer about link"}
      >
        Crew
      </a>
      <a
        data-sveltekit:prefetch
        href="/events"
        class={linkClass}
        aria-label={"Footer about link"}
      >
        Events
      </a>
    </div>
    <div class="flex flex-col space-y-4">
      <ExternalLink
        href="https://soundcloud.com/loose-lips123"
        cssClasses={linkClass}
        ariaLabel={"Footer soundcloud link"}>Soundcloud</ExternalLink
      >
      <ExternalLink
        href="https://www.mixcloud.com/LooseLips123/"
        cssClasses={linkClass}
        ariaLabel={"Footer mixcloud link"}>Mixcloud</ExternalLink
      >
      <ExternalLink
        href="https://looselips123.bandcamp.com/"
        cssClasses={linkClass}
        ariaLabel={"Footer bandcamp link"}>Bandcamp</ExternalLink
      >
      <ExternalLink
        href="https://github.com/natesheehan/loose-lips-2.0"
        cssClasses={linkClass}
        ariaLabel={"Footer github link"}>Github</ExternalLink
      >
    </div>
    <div class="flex flex-col space-y-4">
      <a
        data-sveltekit:prefetch
        href="/snippets"
        class={linkClass}
        aria-label={"Footer Snippets link"}>Sitemap</a
      >
      <a
        data-sveltekit:prefetch
        href="/tags"
        class={linkClass}
        aria-label={"Footer tags link"}>Tags</a
      >
      <a
        data-sveltekit:prefetch
        href="/dashboard"
        class={linkClass}
        aria-label={"Footer dashobard link"}>Contact</a
      >
    </div>
  </div>
  <p style="color: white;text-align:center;font-size:small;font-weight:italic">
    copyright © 2023 All rights reserved Loose-Lips ltd
  </p>
</footer>
