<script lang="ts">
  import ProjectCard from "$components/project-card/ProjectCard.svelte";
  import type { IProjectCard } from "$models/interfaces/iproject-card.interface";
  const events: IProjectCard[] = [
    {
      title: "Loose Lips presents: Sunil Sharpe, Cersy & Kortzer",
      description:
        "Loose Lips brings the legendary Irish turntablist Sunil Sharpe to an exciting new Manchester spot fitted with a beautiful Danley soundsystem. Supported by up and coming techno talent Cersy, and Loose Lips resident Kortzer.",
      slug: "https://github.com/navneetsharmaui/sveltekit-starter",
      img:
        "https://imgproxy.ra.co/_/quality:66/w:1500/rt:fill/aHR0cHM6Ly9pbWFnZXMucmEuY28vODkxMjlmZGEzN2EzZjIxMDEwOTg1YzZiZmNmNjVjZDFlMGI1ZWIwYi5wbmc=",
      icon: "",
      date: "28/01/2023",
    },
  ];
</script>

<div class="flex flex-row justify-left items-start max-w-2xl mx-auto">
  <div class="p-5">
    <!-- Start: Events -->
    <h2
      class="font-bold text-2xl md:text-2xl tracking-tight mb-2 max-w-1xl text-black dark:text-white"
    >
      Upcoming Events
    </h2>
    {#if events.length > 0}
      {#each events as event}
        <ProjectCard project={event} />
      {/each}
    {/if}
    <a href="events" class="viewAll">
      <p class="font-italic text-m text-white">View past events</p>
    </a>
    <!-- End: Top Events -->
  </div>
</div>
