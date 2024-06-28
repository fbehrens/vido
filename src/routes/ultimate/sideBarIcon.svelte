<script>
  export let icon;
  export let text = "tooltip 💡";
</script>

<div class="sidebar-icon group">
  {icon}
  <span class="sidebar-tooltip group-hover:scale-100">
    {text}
  </span>
</div>

<style>
  @tailwind components;
  @layer components {
    .sidebar-icon {
      @apply relative mb-2 mt-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-3xl bg-gray-800 text-green-500 transition-all duration-300 ease-linear hover:rounded-xl hover:bg-green-600 hover:text-white;
    }
    .sidebar-tooltip {
      @apply absolute left-14 m-2 w-auto min-w-max origin-left scale-0 rounded-md bg-gray-950 p-2 text-xs font-bold text-white shadow-md transition-all duration-100;
    }
  }
</style>
