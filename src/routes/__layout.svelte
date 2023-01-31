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
  // Start: Local Imports

  // Start: External Imports
  import "../styles/tailwind.postcss";

  // End: External Imports

  // Core services

  // Components
  import Header from "$ui/components/header/Header.svelte";
  import Footer from "$ui/components/footer/Footer.svelte";
  import RouteTransition from "$ui/components/route-transition/RouteTransition.svelte";
  import NowPlaying from "$components/now-playing/NowPlaying.svelte";

  // Models
  import type { IHeaderNavLink } from "$models/interfaces/iheader-nav-link.interface";
  // End: Local Imports

  // Start: Local component properties

  export let path = "";
  /**
   * @type {IHeaderNavLink}
   */
  const navLinks: IHeaderNavLink[] = [
    {
      path: "/",
      label: "LL",
    },
    {
      path: "/blog",
      label: "BLOG",
    },
    {
      path: "/crew",
      label: "CREW",
    },
    {
      path: "/events",
      label: "EVENTS",
    },
    {
      path: "/mixes",
      label: "MIXES",
    },
  ];

  // End: Local component properties

  // Start: Local component methods

  const toggleThemeMode = (event: CustomEvent<{ dark: boolean }>): void => {
    const htmlTag = document.getElementsByTagName("html").item(0);
    htmlTag.className = event.detail.dark ? "dark" : "light";
  };

  // End: Local component methods
</script>

<div class="dark:bg-black">
  <!-- Start: Header Navigation -->
  <Header
    on:toggleTheme={(e) => toggleThemeMode(e)}
    {navLinks}
    logoImage={"https://i1.sndcdn.com/avatars-C6z0Vyr2LPCI6uHm-ZLN5qA-t200x200.jpg"}
    title={"LOOSE LIPS"}
    useThemeModeButton={true}
    useTitleAndLogo={true}
  />
  <!-- End: Header Navigation -->
  <main id="skip" class="flex flex-col justify-center px-8 dark:bg-black pt-4">
    <!-- Start: Defaull layout slot -->
    <RouteTransition referesh={path}>
      <slot />
    </RouteTransition>
    <!-- End: Defaull layout slot -->
    <!-- Start: Footer -->
    <Footer />
    <!-- End: Footer -->
  </main>
</div>
