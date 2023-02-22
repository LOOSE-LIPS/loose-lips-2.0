<script lang="ts">
  // Start: Local Imports

  // Models
  import type { IHeaderNavLink } from "$models/interfaces/iheader-nav-link.interface";

  // Components
  import { NavigationProgressBar } from "$ui/components/navigation-progress-bar";
  import { NavigationBar } from "$ui/components/navigation-bar";
  // End: Local Imports

  // Start: Exported Properties
  export let logoImage!: string;
  export let title = "LOOSE LIPS";
  export let useTitleAndLogo!: boolean;
  export let useThemeModeButton!: boolean;

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
</script>

<!-- Start: Navigation Progress bar -->
<NavigationProgressBar />
<!-- End: Navigation Progress bar -->

<!-- Start: Navigation bar -->
<NavigationBar
  {navLinks}
  {logoImage}
  {title}
  {useThemeModeButton}
  {useTitleAndLogo}
  on:toggleTheme
/>
<!-- End: Navigation bar -->
