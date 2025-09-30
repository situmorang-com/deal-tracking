<script>
  import { cn } from '$lib/utils';
  
  export let value = '';
  export let placeholder = '';
  export let disabled = false;
</script>

<input
  bind:value
  type="text"
  {placeholder}
  {disabled}
  class={cn(
    'flex h-12 w-full rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/30 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white',
    $$props.class
  )}
  on:input
  on:change
  on:focus
  on:blur
/>