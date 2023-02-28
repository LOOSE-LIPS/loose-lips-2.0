<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Icon from "svelte-awesome";
  import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
  import type { IHeaderNavLink } from "$models/interfaces/iheader-nav-link.interface";
  import { page } from "$app/stores";
  /**
   * @type {IHeaderNavLink}
   */
  export let navLinks!: IHeaderNavLink[];
  export let logoImage!: string;
  export let title = "";
  export let useTitleAndLogo = false;

  const dispatch = createEventDispatcher();
</script>

<header class="opacity-100 relative flex text-gray-900 w-full bg-white">
  <nav
    class="flex flex-row items-center justify-between w-full max-w-4xl  mx-auto opacity-100"
  >
    {#if useTitleAndLogo}
      <div
        class="w-auto p-1 text-gray-900 dark:text-gray-100 font-bold"
        style="position: fixed;
			left: 5%;
			top: 5%;
			transform: translate(-50%, -50%);"
      >
        <a
          data-sveltekit:prefetch
          href="/"
          class="flex flex-row h-12 justify-center items-center drop-shadow-xl"
          aria-label={title}
        >
          <img
            class="h-10 md:h-14 w-auto"
            alt="LL"
            loading="eager"
            decoding="async"
            width="3.5rem"
            height="3.5rem"
            src={logoImage}
          />
        </a>
      </div>
    {/if}
    <div
      class="flex flex-row items-center sm:mr-0"
      style="
      opacity: 1;
		position: fixed;
right: 0!important;
display: flex;
flex-direction: row;
margin-top: 7%;font-size:1.2em;margin-right:1em"
    >
      {#each navLinks as navLink, index (navLink.path)}
        <a
          data-sveltekit:prefetch
          href={navLink.path}
          class="p-1.5 text-gray-900 sm:p-3.5 dark:text-gray-100 hover:border-b-2 hover:border-gray-800 dark:hover:border-gray-100"
          class:nav-active-route={$page.path === navLink.path ||
            $page.path === `${navLink.path}/`}
          class:nav-inactive-route={$page.path !== navLink.path &&
            $page.path !== `${navLink.path}/`}
        >
          {navLink.label}
        </a>
      {/each}
      <div
        class="opacity-100 flex justify-center items-center flex-wrap space-x-2"
        id="menu"
      >

        <!-- <a href="https://soundcloud.com/loose-lips123">
          <ion-icon name="logo-soundcloud" size="large" class="soundcloud" />
        </a>
        <a href="https://www.instagram.com/looselipsevents/?hl=fr">
          <ion-icon name="logo-instagram" size="large" class="instagram" />
        </a>
        <a href="https://www.youtube.com/channel/UCjGQIIPUXfIi-ahpj79p7jA">
          <ion-icon name="logo-youtube" size="large" class="youtube" />
        </a>
        <a href="https://www.youtube.com/channel/UCjGQIIPUXfIi-ahpj79p7jA">
          <ion-icon name="logo-discord" size="large" class="discord" />
        </a>
       
        <a href=" https://looselips123.bandcamp.com/">
          <ion-icon name="logo-discord" size="large" class="discord" />
        </a> -->
      </div>
    </div>
  </nav>
</header>
