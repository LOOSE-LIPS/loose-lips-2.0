<script lang="ts">
  // Start: Local Imports

  import type { IHeaderNavLink } from "$models/interfaces/iheader-nav-link.interface";
  import { NavigationProgressBar } from "$ui/components/navigation-progress-bar";
  import { NavigationBar } from "$ui/components/navigation-bar";
  export let logoImage!: string;
  export let title = "LOOSE LIPS";
  export let useTitleAndLogo!: boolean;

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
    {
      path: "/radio-shows",
      label: "RADIO-SHOWS",
    },
    {
      path: "/labels",
      label: "labels",
    },
  ];
</script>

<!-- <NavigationProgressBar /> -->
<NavigationBar
  {navLinks}
  {logoImage}
  {title}
  {useTitleAndLogo}
  on:toggleTheme
/>
<!-- End: Navigation bar -->
