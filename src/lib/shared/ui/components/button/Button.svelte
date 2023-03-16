<script lang="ts">
  import { cn } from "$lib/models/util";

  export let tag: string;
  export let onClick: () => void;
  export let active: boolean;
</script>

<button
  on:click={onClick}
  class={cn("test text-xl font-bold text-white", [
    active,
    "text-red-500",
    "text-white hover:text-white/60",
  ])}>{tag.toUpperCase()}</button
>
