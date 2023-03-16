<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page }) {
    return {
      props: {
        path: page.path,
      },
    };
  }
</script>

<script lang="ts">
  import "../styles/tailwind.postcss";
  import Header from "$ui/components/header/Header.svelte";
  import Footer from "$ui/components/footer/Footer.svelte";
  import RouteTransition from "$ui/components/route-transition/RouteTransition.svelte";
  import Player from "$shared/components/player/Player.svelte";
  import { currentTrack } from "../stores";
  export let path = "";
  /**
   * @type {IHeaderNavLink}
   */

  const toggleThemeMode = (event: CustomEvent<{ dark: boolean }>): void => {
    const htmlTag = document.getElementsByTagName("html").item(0);
    htmlTag.className = event.detail.dark ? "dark" : "dark";
  };

  let track = "";

  currentTrack.subscribe((prev) => {
    track = prev;
  });
</script>

<div class="">
  <Header
    on:toggleTheme={(e) => toggleThemeMode(e)}
    logoImage={"https://i1.sndcdn.com/avatars-C6z0Vyr2LPCI6uHm-ZLN5qA-t200x200.jpg"}
    title={"LOOSE LIPS"}
    useTitleAndLogo={true}
  />

  <main id="skip" class="flex flex-col justify-center px-8 dark:bg-black pt-4">
    <RouteTransition referesh={path}>
      <slot />
    </RouteTransition>
    <Footer />
  </main>
  <Player {track} />
</div>
