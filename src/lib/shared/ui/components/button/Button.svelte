<script lang="ts">
  export let tag;
  export let handleTagClick;
  const handleStyle = () => {
    console.log("style");
    this.css("background", "red");
  };
</script>

<button
  on:click={() => {
    handleTagClick(tag);
    handleStyle();
  }}
  class="text-xl font-bold text-white hover:text-red-400 active:text-red-500 focus:text-red-700 "
  >{tag.toUpperCase()}</button
>

<style>
</style>
